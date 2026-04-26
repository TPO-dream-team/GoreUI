import type { scansMsg } from "@/pages/ScannerPage/ScannerPage";
import { createSlice, type AnyAction, type Middleware, type PayloadAction, type UnknownAction } from "@reduxjs/toolkit";
import api from "../axios";
import type { RootState } from "../store";
import { REHYDRATE } from "redux-persist";

interface ScanItem {
    id: number;
    data: scansMsg;
}

interface ScanState {
    queue: ScanItem[];
}

const initialState: ScanState = {
    queue: [],
};

const scanSlice = createSlice({
    name: 'scan/offline',
    initialState,
    reducers: {
        enqueueScan: (state, action: PayloadAction<scansMsg>) => {
            state.queue.push({
                data: action.payload,
                id: Date.now()
            });
        },
        removeFromQueue: (state, action: PayloadAction<number>) => {
            state.queue = state.queue.filter(item => item.id !== action.payload);
        }
    }
});


interface LocalState { // I hate TS
    scans: ScanState;
}

export const syncMiddleware: Middleware<{}, LocalState> = (store) => {
    const flushQueue = async () => {
    if (!navigator.onLine) return;

    const { scans } = store.getState();
    if (scans.queue.length === 0) return;

    console.log(`Attempting to sync ${scans.queue.length} items...`);

    for (const scan of scans.queue) {
    try {
        await api.post('/scans', scan.data);
        store.dispatch(removeFromQueue(scan.id));
    } catch (err) {
        console.error("Sync failed for item:", scan.id, err);
        break; 
    }
    }
  };

  return (next) => (action: any) => {
    const result = next(action);

    if (action.type === REHYDRATE) {
      flushQueue();
    }

    if (action.type === 'some_init_action_or_once') {
       window.addEventListener('online', flushQueue);
    }

    return result;
  };
};

export const { enqueueScan, removeFromQueue } = scanSlice.actions;
export default scanSlice.reducer;