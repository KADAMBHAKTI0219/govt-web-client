import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsConditions() {
  return (
    <section 
      id="terms" 
      className="relative w-full bg-white py-16 sm:py-20 px-4 sm:px-8 md:px-12 lg:px-20 border-t border-slate-100 font-sans text-slate-700 text-left"
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Main Section Header with Icon */}
        <div className="flex items-center gap-2 mb-8 text-[#0B1448] px-2">
          <FileText className="w-6 h-6 text-amber-500 shrink-0" />
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Terms & Conditions</h2>
        </div>

        {/* Gradient Border Outline Container */}
        <div className="relative bg-gradient-to-r from-amber-400 via-hot-pink to-royal-blue p-[1px] rounded-2xl shadow-lg shadow-slate-100">
          
          {/* Inner Content Box */}
          <div className="bg-white p-6 sm:p-10 rounded-[15px] flex flex-col gap-8 text-xs sm:text-sm leading-relaxed font-medium">
            
            {/* 1. Eligibility Criteria */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-800">1. Eligibility Criteria</h3>
              <ul className="list-disc pl-5 flex flex-col gap-2.5 text-slate-600">
                <li>
                  <span className="font-bold text-slate-800">Age Requirement:</span> Participants must be 18 years of age or above at the time of nomination.
                </li>
                <li>
                  <span className="font-bold text-slate-800">Nationality and Residency:</span> 24 categories are open exclusively to individuals of Indian nationality. One category is dedicated to international digital creators.
                </li>
                <li>
                  <span className="font-bold text-slate-800">Platforms:</span> Content must be published on one or more of the following digital platforms: Instagram, YouTube, Twitter, LinkedIn, Facebook, ShareChat, Koo, Roposo, or Moj.
                </li>
                <li>
                  <span className="font-bold text-slate-800">Language:</span> Content submission can be in English or any other Indian language.
                </li>
                <li>
                  <span className="font-bold text-slate-800">Nomination Limits:</span> Creators can self-nominate in a maximum of three categories. Those nominating others can nominate in all 25 categories.
                </li>
              </ul>
            </div>

            {/* 2. Nomination Process */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-800">2. Nomination Process</h3>
              <ul className="list-disc pl-5 flex flex-col gap-2.5 text-slate-600">
                <li>
                  <span className="font-bold text-slate-800">Self-Nomination:</span> Creators are allowed to nominate themselves. The nomination must include links to the content on the eligible platforms, a brief description of the content's impact, and any other supporting reasons as required by the nomination form.
                </li>
                <li>
                  <span className="font-bold text-slate-800">Nomination Limits:</span> Creators can self-nominate in a maximum of three categories. Those nominating others can propose nominations across all 25 categories.
                </li>
                <li>
                  <span className="font-bold text-slate-800">Submission Deadline:</span> All nominations must be submitted by the deadline specified in the schedule. Late submissions will not be considered.
                </li>
                <li>
                  <span className="font-bold text-slate-800">Follower Count Consideration:</span> The number of followers or subscribers will be considered as of 31st July 2026.
                </li>
              </ul>
            </div>

            {/* 3. Evaluation and Selection Process */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-800">3. Evaluation and Selection Process</h3>
              <ul className="list-disc pl-5 flex flex-col gap-2.5 text-slate-600">
                <li>
                  <span className="font-bold text-slate-800">Criteria:</span> Nominations will be evaluated based on creativity, impact, reach, innovation, sustainability, and alignment with the goals of the Award.
                </li>
                <li>
                  <span className="font-bold text-slate-800">Jury Review:</span> A panel of domain experts government, academia, media, and civil society will review final nominations. The Jury's decision will be final and binding.
                </li>
                <li>
                  <span className="font-bold text-slate-800">Selection:</span> Winners for each category will be decided based on a combination of the Jury's evaluation and public votes.
                </li>
              </ul>
            </div>

            {/* 4. Award Categories and Prizes */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-800">4. Award Categories and Prizes</h3>
              <ul className="list-disc pl-5 flex flex-col gap-2.5 text-slate-600">
                <li>
                  Awards will be presented across <span className="font-bold text-slate-850">25 distinct categories</span>. In 24 of these categories, a single winner will be selected for each. However, the International Creator Award category would have three winners.
                </li>
              </ul>
            </div>

            {/* 5. Code of Conduct and Compliance */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm sm:text-base font-bold text-slate-800">5. Code of Conduct and Compliance</h3>
              <ul className="list-disc pl-5 flex flex-col gap-2.5 text-slate-600">
                <li>
                  All participants are expected to maintain the highest standards of professionalism, integrity, and ethical conduct throughout the nomination and evaluation process.
                </li>
                <li>
                  Content must comply with applicable laws, community guidelines, and must not infringe upon the intellectual property of third parties. Non-compliance will lead to immediate disqualification.
                </li>
                <li>
                  The decisions of the Jury regarding eligibility, evaluation, and selection of winners shall be final, binding, and conclusive.
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
