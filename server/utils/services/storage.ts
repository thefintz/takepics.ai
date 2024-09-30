import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { H3Event } from "h3";

export class StorageService {
	private readonly supabase: SupabaseClient;
	private readonly bucket: string;

	constructor(supabase: SupabaseClient, bucket: string) {
		this.supabase = supabase;
		this.bucket = bucket;
	}

	async url(id: string) {
		console.info("Getting public URL for file:", id);
		const { data } = this.supabase.storage.from(this.bucket).getPublicUrl(id);
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
			.from(this.bucket)
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
		const url = await this.url(path);
		return { file, url };
	}

	async uploadImage(path: string, data: Buffer) {
		const file = await this.upload(path, data, { contentType: "image/png" });
		const url = await this.url(path);
		return { file, url };
	}
}

export const useServerStorageService = (event?: H3Event) => {
	const config = useRuntimeConfig(event);
	const client = createClient(config.supabase.url, config.supabase.key);
	return new StorageService(client, config.supabase.bucket);
};
