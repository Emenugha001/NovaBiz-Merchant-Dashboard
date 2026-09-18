"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getActiveProfileId } from "../../lib/activeProfile";
import Sidebar from "../sidebar"
import Overview from "../dashboardComponents/hero"
import Services from "../dashboardComponents/services"
import More from "../dashboardComponents/more"
import Transactions from "../dashboardComponents/transactions"
import RecentTransactions from "../dashboardComponents/recentTransactions"
import Statement from "../dashboardComponents/statement"
import Settings from "../dashboardComponents/settings"
import Spending from "../dashboardComponents/spending"
import HeroTransfer from "../transferComponents/heroTransfer"
import HeroAirtime from "../airtimeComponents/heroAirtime"
import HeroData from "../dataComponents/heroData"
import ComingSoon from "../comingSoon"
import OfflineBanner from "../OfflineBanner"


const Dashboard = () => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [active, setActive] = useState("overview");
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isAirtimeOpen, setIsAirtimeOpen] = useState(false);
    const [isDataOpen, setIsDataOpen] = useState(false);
    const [comingSoonTitle, setComingSoonTitle] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        // localStorage doesn't exist during SSR, so this can't be computed during render
        // without a hydration mismatch — it has to be an effect.
        if (getActiveProfileId()) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsAuthorized(true);
        } else {
            router.replace("/login");
        }
    }, [router]);

    if (!isAuthorized) return null;

    function closeAllOverlays() {
        setIsTransferOpen(false);
        setIsAirtimeOpen(false);
        setIsDataOpen(false);
        setComingSoonTitle(null);
    }

    function handleSidebarSelect(key: string) {
        closeAllOverlays();

        if (key === "transfers") {
            setIsTransferOpen(true);
            return;
        }
        if (key === "history") {
            setActive("statement");
            return;
        }
        if (key === "settings") {
            setActive("settings");
            return;
        }
        if (key === "support") {
            setComingSoonTitle("Support");
            return;
        }
        setActive(key);
    }

    const sidebarActive = active === "statement" ? "history" : active;

    return (
        <>
            <OfflineBanner />
            <Sidebar active={sidebarActive} onSelect={handleSidebarSelect} />
            <main className="px-4 pb-8 lg:pl-64">
                {active === "overview" && (
                    <div className="flex flex-col gap-4">
                        <Overview refreshKey={refreshKey} onHistoryClick={() => setActive("statement")} />
                        <Services
                            onMoreClick={() => setActive("more")}
                            onTransferClick={() => setIsTransferOpen(true)}
                            onAirtimeClick={() => setIsAirtimeOpen(true)}
                            onDataClick={() => setIsDataOpen(true)}
                            onStatementClick={() => setActive("statement")}
                        />
                        <Spending refreshKey={refreshKey} />
                        <Transactions refreshKey={refreshKey} onViewAllClick={() => setActive("recent-transactions")} />
                    </div>
                )}
                {active === "more" && (
                    <More onStatementClick={() => setActive("statement")} onSettingsClick={() => setActive("settings")} />
                )}
                {active === "recent-transactions" && <RecentTransactions onBack={() => setActive("overview")} />}
                {active === "statement" && <Statement onBack={() => setActive("overview")} />}
                {active === "settings" && <Settings onBack={() => setActive("overview")} />}
            </main>
            {isTransferOpen && (
                <HeroTransfer
                    onClose={() => setIsTransferOpen(false)}
                    onTransferComplete={() => setRefreshKey((key) => key + 1)}
                />
            )}
            {isAirtimeOpen && (
                <HeroAirtime
                    onClose={() => setIsAirtimeOpen(false)}
                    onTransferComplete={() => setRefreshKey((key) => key + 1)}
                />
            )}
            {isDataOpen && (
                <HeroData
                    onClose={() => setIsDataOpen(false)}
                    onTransferComplete={() => setRefreshKey((key) => key + 1)}
                />
            )}
            {comingSoonTitle && <ComingSoon title={comingSoonTitle} onClose={() => setComingSoonTitle(null)} />}
        </>
        )
}

export default Dashboard
