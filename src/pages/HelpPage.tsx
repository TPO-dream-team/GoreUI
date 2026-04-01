import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function HelpPage() {
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
              <AccordionTrigger>Can I save my tours offline?</AccordionTrigger>
              <AccordionContent>
                Yes! Tap the download icon next to any tour title to save it for offline use.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>How do I change my profile settings?</AccordionTrigger>
              <AccordionContent>
                Go to the "Posts" tab and tap your avatar in the top right corner to access settings.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Still Need Help? */}
        <section className="rounded-lg bg-secondary p-6 text-center">
          <h3 className="mb-2 font-semibold">Still need help?</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Our team is available for a chat Monday through Friday. Just shot us an email. 
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
  )
}

export default HelpPage