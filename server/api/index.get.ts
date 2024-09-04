let counter = 0;

export type Index = {
	time: Date;
	counter: number;
};

export default eventHandler(async (): Promise<Index> => {
	return {
		time: new Date(),
		counter: counter++,
	};
});
