import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
// import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ChevronDown } from "lucide-react";

const Faq = () => {
  const faqsData = [
    {
      question: "What is the material of the t-shirt?",
      answer:
        "Provide details about the fabric type (e.g., cotton, polyester, blend), weight, and any specific features.",
    },
    {
      question: "What are the care instructions for the t-shirt?",
      answer:
        "Outline recommended washing, drying, and ironing methods to maintain quality and longevity.",
    },
    {
      question: "What is the design or print on the t-shirt made of?",
      answer:
        "Explain the material used for the design (e.g., vinyl, screen print, embroidery) and its durability.",
    },
    {
      question: "Is the t-shirt unisex or designed for specific genders?",
      answer:
        "Indicate whether the shirt is suitable for both men and women or targeted towards a particular gender.",
    },
    {
      question: "What are the shipping options and costs?",
      answer:
        "Provide information about shipping methods, estimated delivery times, and associated fees.",
    },
    {
      question: "What is the return policy for the t-shirt?",
      answer:
        "Outline the return window, conditions, and refund or exchange procedures.",
    },
  ];

  return (
    <div className="">
      {faqsData.map((faq, index) => (
        <Disclosure as="div" key={index} className="py-5">
          {({ open }) => (
            <>
              <DisclosureButton className="group flex w-full items-center justify-between">
                <span className="text-[20px] font-medium text-black group-data-hover:text-black/80">
                  {faq.question}
                </span>
                {/* <ChevronDownIcon
                  className={`size-5 fill-black/60 transition-transform group-data-hover:fill-black/50 ${
                    open ? "rotate-180" : ""
                  }`}
                /> */}
                <ChevronDown
                  className={`size-5 fill-black/60 transition-transform group-data-hover:fill-black/50 ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </DisclosureButton>
              <DisclosurePanel className="mt-4 text-[18px] text-black/50">
                {faq.answer}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      ))}
      {/* <Disclosure as="div" className="p-6">
          <DisclosureButton className="group flex w-full items-center justify-between">
            <span className="text-sm/6 font-medium text-black group-data-hover:text-black/80">
              Do you offer technical support?
            </span>
            <ChevronDownIcon className="size-5 fill-black/60 group-data-hover:fill-black/50 group-data-open:rotate-180" />
          </DisclosureButton>
          <DisclosurePanel className="mt-2 text-sm/5 text-black/50">
            No.
          </DisclosurePanel>
        </Disclosure> */}
    </div>
  );
};

export default Faq;
