import type {Brawler} from "../models/brawler.model.ts";

const ENDPOINT = "https://api.brawlify.com/v1/";
type AllBrawlersResponse = {
    list: Brawler[]
}

export function getAllBrawlers(): Promise<Brawler[]> {
    return fetch(`${ENDPOINT}brawlers`)
        .then((res): Promise<AllBrawlersResponse> => res.json())
        .then(r => r.list)
}