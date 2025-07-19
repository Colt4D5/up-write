export const load = async (event: { locals: any }) => {
	return {
		user: event.locals.user
	};
};
