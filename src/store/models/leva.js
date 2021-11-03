

const leva = {
    namespace: 'leva',
    state: {
       editParams: null, 
    },
    reducers: {
        setEditParams(state, playload) {
            return {
                ...state,
                editParams: playload
            }
        },
    },
    effects: dispatch => ({
        setEditParams(params) {
            const { leva } = dispatch || {}
            leva.setEditParams(params)
        }
    })
}

export default leva;