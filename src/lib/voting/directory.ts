import { animalVoteCountSchema } from "@lukespace-cms/client";
import { ballCount, JAR_CAPACITY } from "./model";

export function initAnimalDirectory() {
  document.querySelectorAll<HTMLElement>("[data-animal-directory]").forEach(board => {
    const english = board.dataset.locale === "en";
    const t = (th: string, en: string) => english ? en : th;
    const format = (n: number) => n.toLocaleString(english ? "en-GB" : "th-TH");
    const cards = [...board.querySelectorAll<HTMLElement>("[data-vote-card]")];
    const buttons = [...board.querySelectorAll<HTMLButtonElement>("[data-vote-button]")];
    const feedback = board.querySelector<HTMLElement>("[data-vote-feedback]")!;
    const input = board.querySelector<HTMLInputElement>("input[type=search]")!;
    board.querySelector<HTMLElement>("[data-animal-search]")!.hidden = false;
    const search = () => {
      const query = input.value.trim().toLocaleLowerCase();
      let visible = 0;
      cards.forEach(card => { card.hidden = !card.dataset.search!.includes(query); if (!card.hidden) visible++; });
      board.querySelector("[data-search-status]")!.textContent = t(`พบ ${visible} จาก ${cards.length} ตัว`, `${visible} of ${cards.length} animal friends`);
      board.querySelector<HTMLElement>("[data-search-empty]")!.hidden = visible > 0;
    };
    input.addEventListener("input", search);
    board.querySelector("[data-search-clear]")!.addEventListener("click", () => { input.value = ""; search(); input.focus(); });
    board.querySelectorAll("[data-podium-place]").forEach(link => link.addEventListener("click", () => { input.value = ""; search(); }));
    let pending = false;
    cards.forEach(card => {
      const button = card.querySelector<HTMLButtonElement>("[data-vote-button]")!;
      const toggle = card.querySelector<HTMLButtonElement>("[data-jar-toggle]")!;
      const notice = card.querySelector<HTMLElement>("[data-vote-notice]")!;
      let settleTimer: ReturnType<typeof setTimeout> | undefined;
      let closeTimer: ReturnType<typeof setTimeout> | undefined;
      let pinned = false;
      const showJar = (show: boolean) => {
        card.dataset.showJar = String(show);
        toggle.setAttribute("aria-expanded", String(show));
        toggle.textContent = show ? t("กลับไปดูรูป", "See photo") : t("ดูโหลคะแนน", "See the jar");
      };
      const paintJar = (count: number) => {
        const balls = ballCount(count), full = Math.floor(count / JAR_CAPACITY);
        card.querySelector("[data-vote-balls]")!.replaceChildren(...Array.from({ length: balls }, () => document.createElement("i")));
        card.querySelector<HTMLElement>("[data-full-jars]")!.hidden = full === 0;
        card.querySelector("[data-full-jar-count]")!.textContent = `× ${format(full)}`;
        card.querySelector("[data-jar-summary]")!.textContent = t(`${format(full)} โหลเต็ม และ ${balls} ลูกในโหลปัจจุบัน`, `${format(full)} full jars and ${balls} balls in the current jar`);
      };
      const finishDrop = () => { clearTimeout(settleTimer); card.classList.remove("vote-just-sent"); paintJar(Number(card.dataset.count)); };
      button.disabled = card.dataset.eligible !== "true";
      toggle.disabled = button.disabled;
      toggle.addEventListener("click", () => {
        clearTimeout(closeTimer); finishDrop();
        pinned = card.dataset.showJar !== "true";
        showJar(pinned);
      });
      button.addEventListener("click", async () => {
        if (pending || card.dataset.eligible !== "true") return;
        const id = card.dataset.animalId!;
        const name = card.querySelector("[data-animal-name]")!.textContent!;
        const say = (message: string, short = message) => { feedback.textContent = message; notice.textContent = short; };
        pending = true; buttons.forEach(b => b.setAttribute("aria-disabled", "true"));
        button.setAttribute("aria-busy", "true");
        say(t(`กำลังหยอดใจให้ ${name}…`, `Sending love to ${name}…`), t("กำลังหยอดใจ…", "Sending love…"));
        try {
          const response = await fetch(`/api/votes/${encodeURIComponent(id)}/`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}", signal: AbortSignal.timeout(7000) });
          if (!response.ok) { if (response.status === 404) card.dataset.eligible = "false"; throw new Error("Vote unavailable"); }
          const result = animalVoteCountSchema.parse(await response.json());
          if (result.animalId !== id) throw new Error("Unexpected animal");
          const previous = Number(card.dataset.count);
          card.dataset.count = String(result.count);
          card.querySelector("[data-vote-count]")!.textContent = format(result.count);
          card.querySelector("[data-vote-unit]")!.textContent = t("คะแนน", result.count === 1 ? "vote" : "votes");
          board.dataset.total = String(Number(board.dataset.total) + result.count - previous);
          board.querySelector("[data-vote-total]")!.textContent = format(Number(board.dataset.total));
          board.dispatchEvent(new Event("animal-votes-updated"));
          clearTimeout(closeTimer); finishDrop(); showJar(true);
          toggle.disabled = false;
          // One ball in flight plus the preceding jar contents equals the confirmed count.
          if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
            paintJar(Math.max(0, result.count - 1));
            card.style.setProperty("--drop-distance", `${216 - Math.floor(ballCount(Math.max(0, result.count - 1)) / 7) * 18}px`);
            void card.offsetWidth; card.classList.add("vote-just-sent");
            settleTimer = setTimeout(finishDrop, 720);
          }
          if (!pinned) closeTimer = setTimeout(() => { finishDrop(); showJar(false); }, 4000);
          card.querySelector("[data-vote-label]")!.textContent = t("หยอดใจอีก", "Send again");
          say(t(`หยอดใจให้ ${name} แล้ว ตอนนี้ ${format(result.count)} คะแนน กดซ้ำได้เลย`, `Love sent to ${name}. Now ${format(result.count)} ${result.count === 1 ? "vote" : "votes"}. You can vote again.`), t("+1 หัวใจ · หยอดอีกได้เลย", "+1 heart · Send another"));
        } catch {
          say(card.dataset.eligible === "false" ? t("น้องตัวนี้ปิดรับโหวตแล้ว ลองโหลดรายชื่อล่าสุด", "Voting has closed for this animal. Refresh the animal list.") : t("ยังยืนยันคะแนนไม่ได้ ลองโหลดคะแนนล่าสุดแล้วโหวตใหม่", "Vote not confirmed. Refresh the scores, then try again."));
        } finally {
          pending = false; button.removeAttribute("aria-busy");
          buttons.forEach(b => {
            b.removeAttribute("aria-disabled");
            b.disabled = b.closest<HTMLElement>("[data-vote-card]")!.dataset.eligible !== "true";
          });
        }
      });
    });
  });
}
