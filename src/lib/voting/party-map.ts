import { rankByVotes, voteUnit } from "./model";
import type { PartyId, PartyVoteTotals } from "./party-ids";

export function initAnimalPartyMaps() {
  for (const board of document.querySelectorAll<HTMLElement>(
    "[data-party-board]",
  )) {
    const sheets = [
      ...board.querySelectorAll<HTMLElement>("[data-party-sheet]"),
    ];
    const pins = board.querySelectorAll<HTMLAnchorElement>("[data-party-pin]");
    const picker = board.querySelector<HTMLFormElement>("[data-party-picker]")!;
    const select = picker.querySelector("select")!;
    const placeholder = board.querySelector<HTMLElement>("[data-party-empty]")!;
    const leaderboard = board.querySelector<HTMLOListElement>(
      "[data-party-leaders]",
    )!;
    const places = [
      ...leaderboard.querySelectorAll<HTMLElement>("[data-party-leader]"),
    ];
    const zero = board.querySelector<HTMLElement>("[data-party-zero]")!;
    const unavailable = board.querySelector<HTMLElement>(
      "[data-party-unavailable]",
    )!;
    const total = board.querySelector<HTMLElement>("[data-party-total]")!;
    const totalUnit = board.querySelector<HTMLElement>(
      "[data-party-total-unit]",
    )!;
    const refresh = board.querySelector<HTMLAnchorElement>(
      "[data-party-refresh]",
    )!;
    const buttons =
      board.querySelectorAll<HTMLButtonElement>("[data-party-vote]");
    const locale = board.dataset.locale === "th" ? "th" : "en";
    const format = new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-GB");
    const parties = sheets.map((sheet) => ({
      id: sheet.dataset.partySheet as PartyId,
      name: sheet.dataset.partyName!,
      sortOrder: Number(sheet.dataset.partyOrder),
      sheet,
      score: sheet.querySelector<HTMLElement>("[data-party-score]")!,
      scoreUnit: sheet.querySelector<HTMLElement>("[data-party-score-unit]")!,
      feedback: sheet.querySelector<HTMLElement>("[data-party-feedback]")!,
    }));
    const partiesById = new Map(parties.map((party) => [party.id, party]));
    let busy = false;

    function showParty(id: string, moveFocus = false) {
      const party = partiesById.get(id as PartyId);
      placeholder.hidden = !!party;
      for (const { sheet } of parties) sheet.hidden = party?.sheet !== sheet;
      for (const pin of pins) {
        if (pin.dataset.partyPin === id)
          pin.setAttribute("aria-current", "location");
        else pin.removeAttribute("aria-current");
      }
      select.value = party?.id ?? "";
      if (party && moveFocus) {
        const heading = party.sheet.querySelector<HTMLElement>(
          "[data-party-heading]",
        )!;
        heading.focus({ preventScroll: true });
        heading.scrollIntoView({ block: "nearest", behavior: "instant" });
      }
    }

    function selectParty(id: string) {
      if (!partiesById.has(id as PartyId)) return;
      history.replaceState(history.state, "", `#party-${id}`);
      showParty(id, true);
    }

    function revealHash(isInitial = false) {
      const target = document.getElementById(location.hash.slice(1));
      const sheet = target?.closest<HTMLElement>("[data-party-sheet]");
      if (sheet && board.contains(sheet)) {
        showParty(sheet.dataset.partySheet!);
        requestAnimationFrame(() =>
          target?.scrollIntoView({ block: "start", behavior: "instant" }),
        );
      } else if (isInitial) {
        showParty("");
      }
    }

    function updateTotals(totals: PartyVoteTotals) {
      const counts = new Map(
        totals.items.map(({ partyId, count }) => [partyId, count]),
      );
      const leaders = rankByVotes(
        parties.map((party) => {
          const count = counts.get(party.id) ?? 0;
          party.score.textContent = format.format(count);
          party.scoreUnit.textContent = voteUnit(locale, count);
          return { ...party, count };
        }),
      ).filter(({ rank }) => rank !== null);

      for (const [index, place] of places.entries()) {
        const leader = leaders[index];
        place.hidden = !leader;
        if (!leader) continue;
        const link = place.querySelector("a")!;
        link.href = `#party-${leader.id}`;
        link.dataset.partyLink = leader.id;
        place.querySelector("[data-place]")!.textContent = String(leader.rank);
        place.querySelector("[data-leader-name]")!.textContent = leader.name;
        place.querySelector("[data-leader-count]")!.textContent = format.format(
          leader.count,
        );
        place.querySelector("[data-leader-unit]")!.textContent = voteUnit(
          locale,
          leader.count,
        );
      }
      leaderboard.hidden = leaders.length === 0;
      total.textContent = format.format(totals.total);
      totalUnit.textContent = voteUnit(locale, totals.total);
      total.closest<HTMLElement>(".party-total")!.hidden = false;
      zero.hidden = leaders.length > 0;
      unavailable.hidden = true;
      board.dataset.ready = "true";
      for (const button of buttons) button.disabled = false;
    }

    function setBusy(value: boolean) {
      busy = value;
      for (const control of [...buttons, refresh]) {
        if (value) control.setAttribute("aria-disabled", "true");
        else control.removeAttribute("aria-disabled");
      }
    }

    board.addEventListener("click", (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>("[data-party-link]");
      if (
        link &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        event.preventDefault();
        selectParty(link.dataset.partyLink!);
      }
    });
    picker.addEventListener("submit", (event) => {
      event.preventDefault();
      selectParty(select.value);
    });
    refresh.addEventListener("click", async (event) => {
      event.preventDefault();
      if (busy) return;
      setBusy(true);
      try {
        const response = await fetch("/api/party-votes/", {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Scores unavailable");
        updateTotals((await response.json()) as PartyVoteTotals);
      } catch {
        unavailable.hidden = false;
        zero.hidden = true;
      } finally {
        setBusy(false);
      }
    });
    for (const button of buttons) {
      const party = partiesById.get(button.dataset.partyVote as PartyId)!;
      button.disabled = board.dataset.ready !== "true";
      button.addEventListener("click", async () => {
        if (busy) return;
        setBusy(true);
        party.feedback.textContent = board.dataset.pending!;
        try {
          const response = await fetch(`/api/party-votes/${party.id}/`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: "{}",
          });
          if (!response.ok) throw new Error("Vote unavailable");
          updateTotals((await response.json()) as PartyVoteTotals);
          party.feedback.textContent = board.dataset.success!.replace(
            "{party}",
            party.name,
          );
        } catch {
          party.feedback.textContent = board.dataset.failure!;
        } finally {
          setBusy(false);
        }
      });
    }
    window.addEventListener("hashchange", () => revealHash());
    picker.hidden = false;
    board.dataset.partyEnhanced = "true";
    revealHash(true);
  }
}
