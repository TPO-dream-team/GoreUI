import { ArrowLeft, Mail, HelpCircle, Mountain, MessageSquare, Map, Scan, Wifi, User, ShieldCheck, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";

function HelpPage() {
  const outletContext = useOutletContext<{ useNewStyle?: boolean }>();
  const [useNewStyle, setUseNewStyle] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("useNewStyle");
    setUseNewStyle(saved !== null ? saved === "true" : true);

    const handleStyleToggle = (event: CustomEvent) => {
      setUseNewStyle(event.detail.useNewStyle);
    };

    window.addEventListener("styleToggle", handleStyleToggle as EventListener);
    return () => {
      window.removeEventListener("styleToggle", handleStyleToggle as EventListener);
    };
  }, []);

  useEffect(() => {
    if (outletContext?.useNewStyle !== undefined) {
      setUseNewStyle(outletContext.useNewStyle);
    }
  }, [outletContext]);

  // New Style (Mountain Theme)
  if (useNewStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-bg via-brand-bg to-white">
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-3xl">
          
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => window.history.back()}
              className="rounded-full text-brand-body hover:text-brand-primary hover:bg-brand-accent-sage"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-hover-blue flex items-center justify-center shadow-md">
                <HelpCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-brand-headline">Help</h1>
                <p className="text-sm text-brand-body">Answers to frequently asked questions</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Quick Stats / Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white border border-brand-border/60 rounded-lg p-3 text-center shadow-sm">
                <Scan className="w-5 h-5 text-brand-hover-blue mx-auto mb-2" />
                <div className="text-sm font-semibold text-brand-headline">GPS + NFC</div>
                <div className="text-xs text-brand-body">Double verification</div>
              </div>
              <div className="bg-white border border-brand-border/60 rounded-lg p-3 text-center shadow-sm">
                <Wifi className="w-5 h-5 text-brand-warning mx-auto mb-2" />
                <div className="text-sm font-semibold text-brand-headline">Offline mode</div>
                <div className="text-xs text-brand-body">Saving scans</div>
              </div>
              <div className="bg-white border border-brand-border/60 rounded-lg p-3 text-center shadow-sm">
                <ShieldCheck className="w-5 h-5 text-brand-primary mx-auto mb-2" />
                <div className="text-sm font-semibold text-brand-headline">AI moderation</div>
                <div className="text-xs text-brand-body">Safe community</div>
              </div>
              <div className="bg-white border border-brand-border/60 rounded-lg p-3 text-center shadow-sm">
                <MessageSquare className="w-5 h-5 text-brand-warning mx-auto mb-2" />
                <div className="text-sm font-semibold text-brand-headline">Community</div>
                <div className="text-xs text-brand-body">Sharing experiences</div>
              </div>
            </div>

            {/* FAQs Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="w-5 h-5 text-brand-primary" />
                <h2 className="text-lg font-semibold text-brand-headline">Frequently Asked Questions</h2>
              </div>
              
              <div className="bg-white rounded-xl border border-brand-border/60 shadow-sm overflow-hidden">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b border-brand-border/40">
                    <AccordionTrigger className="px-5 py-4 text-brand-headline hover:text-brand-primary hover:no-underline transition-colors">
                      How do I start scanning?
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4 text-brand-body leading-relaxed">
                      Press the "Scan" button on the home page. The app will first check your GPS location, then ask you to bring your phone close to the NFC tag at the summit. Both steps are required for successful verification.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-2" className="border-b border-brand-border/40">
                    <AccordionTrigger className="px-5 py-4 text-brand-headline hover:text-brand-primary hover:no-underline transition-colors">
                      Can I save tours without an internet connection?
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4 text-brand-body leading-relaxed">
                      Yes! All scanned peaks and comments are saved locally on your device. When you reconnect to the internet, the data is automatically synchronized with the server.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-3" className="border-b border-brand-border/40">
                    <AccordionTrigger className="px-5 py-4 text-brand-headline hover:text-brand-primary hover:no-underline transition-colors">
                      Why does the app require both GPS and NFC verification?
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4 text-brand-body leading-relaxed">
                      GPS confirms that you are near the summit, while NFC confirms that you physically reached the marked checkpoint. Using both methods helps prevent fake check-ins and improves reliability.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-4" className="border-b border-brand-border/40 last:border-0">
                    <AccordionTrigger className="px-5 py-4 text-brand-headline hover:text-brand-primary hover:no-underline transition-colors">
                      Why is my post held for moderation?
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4 text-brand-body leading-relaxed">
                      Our AI moderator automatically checks all posts and comments. If the system detects potentially inappropriate content, empty comments, or unclear descriptions, the post is temporarily held. A moderator will review it as soon as possible.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-5" className="border-b border-brand-border/40 last:border-0">
                    <AccordionTrigger className="px-5 py-4 text-brand-headline hover:text-brand-primary hover:no-underline transition-colors">
                      How do I join a tour?
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4 text-brand-body leading-relaxed">
                      Open the Tours page and browse available hikes. You can view details such as difficulty, duration, organizer, and discussion comments before commenting on the tour.
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="item-6" className="last:border-0">
                    <AccordionTrigger className="px-5 py-4 text-brand-headline hover:text-brand-primary hover:no-underline transition-colors">
                      Can other users see my completed peaks?
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4 text-brand-body leading-relaxed">
                      Yes. Your scanned peaks are displayed on your profile so other hikers can view your progress and achievements.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </section>

            {/* Contact Support Section */}
            <section className="rounded-xl bg-gradient-to-r from-brand-primary to-brand-hover-blue p-6 text-center shadow-md">
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Still need help?</h3>
              <p className="text-white/80 text-sm mb-5 max-w-md mx-auto">
                Our team is available every weekday. Send us an email and we will reply as soon as possible.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="bg-white hover:bg-gray-100 text-brand-primary rounded-full gap-2 transition-colors">
                  <a href="mailto:support@peakproof.com?subject=Support Request">
                    <Mail className="h-4 w-4" />
                    support@peakproof.com
                  </a>
                </Button>
              </div>
            </section>

            {/* Quick Tips */}
            <section className="bg-brand-nested-bg rounded-xl p-5 border border-brand-border/60">
              <div className="flex items-center gap-2 mb-3">
                <Mountain className="w-5 h-5 text-brand-primary" />
                <h3 className="font-semibold text-brand-headline">Quick tips</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-brand-accent-sage flex items-center justify-center mt-0.5 shrink-0">
                    <span className="text-xs text-brand-primary font-bold">1</span>
                  </div>
                  <span className="text-brand-slate">For more accurate GPS, try standing in an open area</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-brand-accent-sage flex items-center justify-center mt-0.5 shrink-0">
                    <span className="text-xs text-brand-primary font-bold">2</span>
                  </div>
                  <span className="text-brand-slate">NFC tags are usually placed on information boards or summit registers</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-brand-accent-sage flex items-center justify-center mt-0.5 shrink-0">
                    <span className="text-xs text-brand-primary font-bold">3</span>
                  </div>
                  <span className="text-brand-slate">Offline scans are automatically synchronized when you reconnect</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-brand-accent-sage flex items-center justify-center mt-0.5 shrink-0">
                    <span className="text-xs text-brand-primary font-bold">4</span>
                  </div>
                  <span className="text-brand-slate">Take part in the community through posts and comments</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  // Old Style (Original Design)
  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">User help</h1>
      </div>

      <div className="mx-auto max-w-2xl space-y-8">
        {/* FAQs */}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I start a scan?</AccordionTrigger>
              <AccordionContent>
                Tap the "Scan" button on the home screen and point your camera at the QR code or object.
              </AccordionContent>
            </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>Why does the app require both GPS and NFC verification?</AccordionTrigger>
            <AccordionContent>
              GPS confirms that you are near the summit, while NFC confirms that you physically reached the marked checkpoint. Using both methods helps prevent fake check-ins and improves reliability.
            </AccordionContent>
          </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Can I save my tours offline?</AccordionTrigger>
              <AccordionContent>
                Yes! Tap the download icon next to any tour title to save it for offline use.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>How do I join a tour?</AccordionTrigger>
              <AccordionContent>
                Open the Tours page and browse available hikes. You can view details such as difficulty, duration, organizer, and discussion comments before commenting on the tour.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Can other users see my completed peaks?</AccordionTrigger>
              <AccordionContent>
                Yes. Your scanned peaks are displayed on your profile so other hikers can view your progress and achievements.
              </AccordionContent>
            </AccordionItem>

          </Accordion>
        </section>

        {/* Still Need Help? */}
        <section className="rounded-lg bg-secondary p-6 text-center">
          <h3 className="mb-2 font-semibold">Still need help?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Our team is available for a chat Monday through Friday. Just shoot us an email. 
          </p>
          <Button asChild className="w-full sm:w-auto">
            <a href="mailto:support@example.com?subject=Support Request">
              <Mail className="mr-2 h-4 w-4" />
              support@peakproof.com
            </a>
          </Button>
        </section>
      </div>
    </div>
  );
}

export default HelpPage;