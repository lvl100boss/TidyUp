import { createContext, useContext, useReducer } from "react";

const BookingContext = createContext();

const initialState = {
    step: 1,
    selectedDate: null,
    selectedTimeSlots: [],
    additionalUsers: [],
    selectedServices: {},
    totalCost: 0,
};

function bookingReducer(state, action) {
    switch (action.type) {
        case "SET_STEP":
            return { ...state, step: action.payload };
        case "SET_DATE":
            return { ...state, selectedDate: action.payload };
        case "SET_TIME_SLOTS":
            return { ...state, selectedTimeSlots: action.payload };
        case "ADD_USER":
            return {
                ...state,
                additionalUsers: [...state.additionalUsers, action.payload],
            };
        case "REMOVE_USER":
            return {
                ...state,
                additionalUsers: state.additionalUsers.filter(
                    (user) => user.id !== action.payload
                ),
            };
        case "SET_SERVICES":
            return { ...state, selectedServices: action.payload };
        case "UPDATE_TOTAL":
            return { ...state, totalCost: action.payload };
        default:
            return state;
    }
}

export function BookingProvider({ children }) {
    const [state, dispatch] = useReducer(bookingReducer, initialState);

    return (
        <BookingContext.Provider value={{ state, dispatch }}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error("useBooking must be used within a BookingProvider");
    }
    return context;
}
