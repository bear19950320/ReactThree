
const editControls = {
    namespace: 'editControls',
    state: {
       editObject: null, 
    },
    reducers: {
        setEditObject(state, playload) {
            return {
                ...state,
                editObject: playload
            }
        },
    },
    effects: dispatch => ({
        setEditObject(params) {
            const { editControls } = dispatch || {}
            editControls.setEditObject(params)
        }
    })
}

export default editControls;