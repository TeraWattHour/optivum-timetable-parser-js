import { JSDOM } from "jsdom";

export const getRootTable = (container: Element): Element => {
  const table = container.querySelector(".tabela");
  if (table) {
    return table;
  }

  const tables = container.querySelectorAll("table");
  for (const table of Array.from(tables)) {
    const nested = table.querySelectorAll("table");
    if (nested.length === 1) {
      return table;
    } else if (nested.length !== 0) return getRootTable(table);
  }

  return container;
};

export const getRows = (table: Element): HTMLTableRowElement[] => {
  return Array.from(table.querySelectorAll("tr"));
};

export const getDays = (table: Element): string[] => {
  let days = Array.from(table.querySelectorAll("th")).map((cell) =>
    cell.textContent.trim()
  );
  const rows = Array.from(table.querySelectorAll("tr"));

  const hasLessons = new Array(days.length).fill(false);

  for (const row of rows) {
    const cells = Array.from(row.querySelectorAll("td"));
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].classList.contains("l")) hasLessons[i] = true;
    }
  }

  return days.filter((_, i) => hasLessons[i]);
};

export const getLessonsMatrix = (table: Element) => {
  let rows = getRows(table).slice(1);
  const days = getDays(table);
  const lessons: ILesson[][] = new Array(days.length);
  for (let i = 0; i < lessons.length; i++) {
    lessons[i] = new Array(Array.from(rows[i].children).length);
  }

  for (let i = 0; i < rows.length; i++) {
    // wiersze z danymi o lekcjach w różnych dniach, pionowo, i -> numer godziny
    const row = rows[i];
    const cells = Array.from(row.querySelectorAll("td")).filter(
      (x) => !x.classList.contains("g") && !x.classList.contains("nr")
    );
    if (cells.length === 0) continue;

    for (let j = 0; j < cells.length; j++) {
      // wiesz z danymi o lekcjach w różnych dniach, poziomo, j -> numer dnia
      const cell = cells[j];

      const groups = [];
      const groupCells = cell.innerHTML
        .split("<br>")
        .map((x) => new JSDOM(x).window.document);
      for (const groupCell of groupCells) {
        const group: IGroup = {
          subject: Array.from(groupCell.querySelectorAll(".p"))
            .map((x) => x.textContent.trim())
            .join(" "),
          room: groupCell.querySelector(".s")?.textContent.trim(),
          teacher: groupCell.querySelector(".n")?.textContent.trim(),
        };
        if (!group.subject || group.subject === "") {
          continue;
        }
        groups.push(group);
      }
      lessons[j][i] = {
        index: i + 1,
        groups,
      };
    }
  }
  return lessons;
};
