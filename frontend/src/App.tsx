import { FC } from "react";
import CustomHistoryRouter from "./routes/CustomHistoryRouter";
import { history } from "./services/history";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


import AppRoutes from "./routes/Router";
import { Toaster } from "./components/ui/toaster";

const queryClient = new QueryClient();

const App: FC = () => {
    return(
        <>
        <QueryClientProvider client={queryClient}>
        <CustomHistoryRouter history={history}>
            <div className="App flex h-screen flex-col overflow-y-auto overflow-x-hidden">
             <AppRoutes />
        </div>
        </CustomHistoryRouter>
        </QueryClientProvider>
        <Toaster />
        </>
        
    )
}

export default App;