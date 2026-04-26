import { Button } from "@/components/ui/button";
import { ShieldCheck, ShieldAlert, Info } from "lucide-react";

function ModeratorPage() {
    return (
        <div className="flex flex-col items-center min-h-scree ">
            <div className="flex flex-col items-center justify-center h-full overflow-hidden relative">

                <section className="w-full md:max-w-xl flex flex-col p-4 z-10 pb-30">
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-cyan-800/20">

                        {/* Header Meta */}
                        <div className="p-2 border-b text-center shrink-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-cyan-900">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                                Pending Review
                            </span>
                        </div>

                        {/* New User/Time/Category Meta Bar */}
                        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b text-[11px] text-gray-500 font-medium">
                            <div className="flex gap-1">
                                <span>From:</span>
                                <span className="text-cyan-700 font-bold">@username</span>
                            </div>
                            <div className="bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full text-[9px] uppercase font-bold">
                                Category: Board content
                            </div>
                            <div className="flex gap-1">
                                <span>At:</span>
                                <span className="text-gray-700">Oct 24, 2023</span>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="p-8 flex items-center justify-center border-b overflow-y-auto max-h-[40vh] bg-white">
                            <p className="text-lg md:text-xl text-gray-800 text-center italic leading-relaxed">
                                "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat nesciunt ad neque sunt quisquam culpa ducimus aperiam accusamus modi ea."
                            </p>
                        </div>

                        {/* Confidence Info */}
                        <div className="p-2 bg-white flex items-center justify-center gap-2 border-b shrink-0">
                            <Info size={14} className="text-blue-400" />
                            <p className="text-xs text-blue-600">
                                AI is <span className="font-bold">69%</span> confident that this is spam
                            </p>
                        </div>

                        {/* Zadnje metrike */}
                        <div className="p-2 bg-white flex items-center justify-center gap-2 border-b shrink-0">
                            <div className="flex gap-3 text-[10px] text-gray-500 uppercase tracking-wider">
                                <span>F1: <span className="font-bold text-blue-600">0.82</span></span>
                                <span>Precision: <span className="font-bold text-blue-600">0.85</span></span>
                                <span>Recall: <span className="font-bold text-blue-600">0.79</span></span>
                            </div>
                        </div>

                        {/* Integrated Action Buttons */}
                        <div className="p-4 grid grid-cols-2 gap-3 shrink-0 bg-gradient-to-br from-slate-950 via-cyan-950 to-cyan-900">
                            <Button
                                variant="destructive"
                                className="h-12 text-sm font-bold bg-red-500 hover:bg-red-600 rounded-lg flex gap-2 shadow-sm active:scale-95 transition-transform"
                            >
                                <ShieldAlert size={18} />
                                SPAM
                            </Button>
                            <Button className="h-12 text-sm font-bold rounded-lg bg-green-600 hover:bg-green-700 flex gap-2 shadow-sm active:scale-95 transition-transform">
                                <ShieldCheck size={18} />
                                SAFE
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ModeratorPage;