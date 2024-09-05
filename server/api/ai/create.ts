import Replicate from "replicate";

const replicate = new Replicate();

export default defineEventHandler(async (event) => {
	const input = {
		prompt: "a cat taking a nap on a work table, in the style of BSstyle004",
	};

	const model =
		"bingbangboom-lab/flux-dreamscape:b761fa16918356ee07f31fad9b0d41d8919b9ff08f999e2d298a5a35b672f47e";
	const version =
		"2ed2f6d1a8563caa2cfada419dffc68b52881bab9bac30c0b8cbe05a4dcae0e5";

	const output = await replicate.predictions.create({ version, input });
	console.log(output);

	return output;
});
