import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { H3Event } from "h3";
import { toBase64 } from "../common";

export class StorageService {
	private readonly supabase: SupabaseClient;

	constructor(supabase: SupabaseClient) {
		this.supabase = supabase;
	}

	async url(id: string) {
		console.info("Getting public URL for file:", id);
		const { data } = this.supabase.storage.from("aiphoto-dev").getPublicUrl(id);
		console.info(`Got public URL ${data.publicUrl} for file: ${id}`);
		console.debug(data);
		return data;
	}

	async upload(
		path: string,
		data: string | Buffer,
		opts?: Record<string, string>,
	) {
		console.info("Uploading file to:", path);
		console.debug("File size:", data.length);
		const { data: upload, error } = await this.supabase.storage
			.from("aiphoto-dev")
			.upload(path, data, opts);
		if (error) throw error;
		console.info("Uploaded file:", upload.id);
		console.debug(upload);
		return upload;
	}

	async uploadZip(path: string, data: string) {
		const base64 = data.replace("data:application/zip;base64,", "");
		const buffer = Buffer.from(base64, "base64");
		const file = await this.upload(path, buffer, {
			contentType: "application/zip",
		});
		const url = await this.url(file.id);
		return { file, url };
	}

	async uploadImage(path: string, data: Blob) {
		const base64 = await toBase64(data);
		const file = await this.upload(path, base64, { contentType: "image/jpeg" });
		const url = await this.url(file.id);
		return { file, url };
	}
}

export const useServerStorageService = (event?: H3Event) => {
	const config = useRuntimeConfig(event);
	const client = createClient(config.supabaseUrl, config.supabaseKey);
	return new StorageService(client);
};
