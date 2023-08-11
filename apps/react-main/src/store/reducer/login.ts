import { create } from 'zustand'

type State = {

}

type Actions = {

}

type Action = {
  type: keyof Actions
}

const LoginReducer = (state: State, action: Action) => {
  switch ( action.type ) {
    default: 
      return state
  }
}
export const Login  = create<State & Actions>((set) => ({
  dispatch: (action: Action) => set((state) => LoginReducer(state, action))
}))