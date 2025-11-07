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
import TermsEnPage from "@/pages/legal/terms.en";
import PrivacyEnPage from "@/pages/legal/privacy.en";
import TermsJaPage from "@/pages/legal/terms.ja";
import PrivacyJaPage from "@/pages/legal/privacy.ja";
import { LanguageProvider } from "@/language/language-context";

const HOME_ROUTES = ["/", "/tw", "/jp"] as const;
const SUCCESS_ROUTES = ["/success", "/tw/success", "/jp/success"] as const;
const LEGAL_ROUTES = [
  { path: "/legal/terms", component: TermsZhTWPage },
  { path: "/legal/privacy", component: PrivacyZhTWPage },
  { path: "/en/legal/terms", component: TermsEnPage },
  { path: "/en/legal/privacy", component: PrivacyEnPage },
  { path: "/jp/legal/terms", component: TermsJaPage },
  { path: "/jp/legal/privacy", component: PrivacyJaPage },
] as const;

function Router() {
  return (
    <Switch>
      {HOME_ROUTES.map((path) => (
        <Route key={path} path={path} component={Home} />
      ))}
      {SUCCESS_ROUTES.map((path) => (
        <Route key={path} path={path} component={Success} />
      ))}
      {LEGAL_ROUTES.map(({ path, component: Component }) => (
        <Route key={path} path={path} component={Component} />
      ))}
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
