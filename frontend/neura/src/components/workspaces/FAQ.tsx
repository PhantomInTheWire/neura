"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FAQ_DATA } from "@/data/workspace";

export default function FAQ() {
  return (
    // Removed container div with p-6 to avoid double padding from layout
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Common questions about PinSage and Graph Convolutional Networks
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible className="w-full">
            {FAQ_DATA.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left cursor-pointer">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
}
