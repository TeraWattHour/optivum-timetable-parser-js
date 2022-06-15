type ILesson = {
  index: number;
  groups: IGroup[];
};

type IGroup = {
  subject: string;
  teacher?: string;
  room?: string;
};
