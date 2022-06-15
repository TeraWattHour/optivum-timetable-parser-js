import { getDays, getLessonsMatrix, getRootTable } from "./helpers";
import { parseStringToDocument } from "./parser";

export class Table {
  private container: Document;
  private table: Element;

  constructor(file: string) {
    const document = parseStringToDocument(file);
    this.container = document;
    this.table = getRootTable(document.documentElement);
  }

  public get dayNames(): string[] {
    return getDays(this.table);
  }

  public get hours(): IHour[] {
    const indexes = Array.from(this.table.querySelectorAll("td.nr")).map((x) =>
      parseInt(x.textContent.trim())
    );
    const hours = Array.from(this.table.querySelectorAll("td.g")).map((cell) =>
      cell.textContent.split("-")
    );

    return hours.map(([start, end]) => ({
      index: indexes.shift(),
      startsAt: start.trim(),
      endsAt: end.trim(),
    }));
  }

  public get days(): IDayWithLessons[] {
    const days = getDays(this.table);
    const lessons = getLessonsMatrix(this.table);

    let daysWithLessons: IDayWithLessons[] = [];
    for (let i = 0; i < days.length; i++) {
      daysWithLessons.push({
        day: days[i],
        lessons: lessons[i],
      });
    }

    return daysWithLessons;
  }

  public get name(): string {
    return this.container.querySelector(".tytulnapis")?.textContent.trim();
  }
}

type IHour = {
  index: number;
  startsAt: string;
  endsAt: string;
};

type IDayWithLessons = {
  day: string;
  lessons: any[];
};
