import { rankAnimals } from "./model";

export function initPodiums() {
  document
    .querySelectorAll<HTMLElement>("[data-animal-podium]")
    .forEach((root) => {
      const board = root.closest<HTMLElement>("[data-animal-directory]");
      const english = root.dataset.locale === "en";
      const places = [
        ...root.querySelectorAll<HTMLAnchorElement>("[data-podium-place]"),
      ];
      if (board) {
        const update = () => {
          const ranked = rankAnimals(
            [...board.querySelectorAll<HTMLElement>("[data-resident]")]
              .filter((c) => c.dataset.eligible === "true")
              .map((card, index) => ({
                card,
                sortOrder: index,
                count: Number(card.dataset.count),
              })),
          );
          places.forEach((place, index) => {
            const animal = ranked[index];
            place.hidden = !animal;
            if (!animal) return;
            const name =
              animal.card.querySelector("[data-animal-name]")!.textContent!;
            const id = animal.card.dataset.animalId!;
            if (place.dataset.animalId !== id) {
              const image = animal.card.querySelector("[data-animal-portrait]");
              place
                .querySelector(".podium-portrait")!
                .replaceChildren(
                  ...(image
                    ? [image.cloneNode(true)]
                    : [document.createTextNode("◇")]),
                );
            }
            place.dataset.animalId = id;
            place.dataset.rank = String(animal.rank ?? 0);
            const level =
              animal.rank === 1 ? "1" : animal.rank === 2 ? ".37" : "0";
            place.style.setProperty("--podium-level", level);
            root
              .querySelectorAll<HTMLElement>(".podium-block")
              [index]?.style.setProperty("--podium-level", level);
            place.href = `${english ? "/en" : ""}/animals/#animal-${id}`;
            place.querySelector("[data-podium-name]")!.textContent = name;
            place.querySelector("[data-podium-score]")!.textContent =
              animal.count.toLocaleString(english ? "en-GB" : "th-TH");
            place.querySelector("[data-podium-unit]")!.textContent = english
              ? animal.count === 1
                ? "vote"
                : "votes"
              : "คะแนน";
            place.querySelector("[data-podium-rank]")!.textContent = animal.rank
              ? `${english ? "Rank" : "อันดับ"} ${animal.rank}`
              : english
                ? "Waiting for love"
                : "รอหัวใจ";
          });
          root.dispatchEvent(new Event("podium-updated"));
        };
        board.addEventListener("animal-votes-updated", update);
      }
      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          observer.disconnect();
          import("./podium-scene")
            .then(({ createPodiumScene }) => createPodiumScene(root))
            .catch(() => {
              root.dataset.renderer = "fallback";
            });
        },
        { rootMargin: "150px" },
      );
      observer.observe(root);
    });
}
