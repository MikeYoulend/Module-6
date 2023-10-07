const initialState = {
	posts: [], // L'elenco completo dei post
	filteredPosts: [], // L'elenco dei post filtrati
};

const rootReducer = (state = initialState, action) => {
	switch (action.type) {
		case "SET_POSTS":
			return {
				...state,
				posts: action.payload,
			};
		case "SET_FILTERED_POSTS":
			return {
				...state,
				filteredPosts: action.payload,
			};
		default:
			return state;
	}
};

export const setPosts = (posts) => ({
	type: "SET_POSTS",
	payload: posts,
});

export const setFilteredPosts = (filteredPosts) => ({
	type: "SET_FILTERED_POSTS",
	payload: filteredPosts,
});

export default rootReducer;
