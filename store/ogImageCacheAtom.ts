import { atom } from "jotai";

export type OgImageEntry = {
	status: "loading" | "success" | "error";
	data: string | null;
};

export type OgImageCache = Record<string, OgImageEntry>;

// キャッシュ本体 (url -> {status, data})
export const ogImageCacheAtom = atom<OgImageCache>({});

// リクエストの重複を防ぐための in-flight マップ (url -> Promise)
export const ogInFlightMap = new Map<string, Promise<string | null>>();
