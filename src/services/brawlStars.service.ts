import type { BrawlerModel } from "../models/brawler.model.ts";

const ENDPOINT = "https://api.brawlify.com/v1/";
type AllBrawlersResponse = {
    list: BrawlerModel[];
};

export function getAllBrawlers(): Promise<BrawlerModel[]> {
    return fetch(`${ENDPOINT}brawlers`)
        .then((res): Promise<AllBrawlersResponse> => res.json())
        .then((r) => r.list);
}
