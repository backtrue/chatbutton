import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Success from "@/pages/Success";
import NotFound from "@/pages/not-found";
import TermsZhTWPage from "@/pages/legal/terms.zh-TW";
import PrivacyZhTWPage from "@/pages/legal/privacy.zh-TW";
import { LanguageProvider } from "@/language/language-context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/success" component={Success} />
      <Route path="/legal/terms" component={TermsZhTWPage} />
      <Route path="/legal/privacy" component={PrivacyZhTWPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
