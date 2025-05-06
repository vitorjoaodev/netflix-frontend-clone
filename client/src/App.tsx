import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Browse from "@/pages/Browse";
import ProfileSelect from "@/pages/ProfileSelect";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";

function Router() {
  const [location] = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/browse" component={Browse} />
          <Route path="/profiles" component={ProfileSelect} />
          <Route component={NotFound} />
        </Switch>
      </div>
      
      {/* Only show footer on main pages */}
      {(location === "/" || location === "/browse") && <Footer />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
