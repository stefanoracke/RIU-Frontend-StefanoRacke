export interface IHero {
  id: number;
  name: string;
  power: string;
  alterEgo?: string;
}


export interface PaginatedHeroes {
  items: IHero[];
  total: number;
  totalPages: number;
  currentPage: number;
}