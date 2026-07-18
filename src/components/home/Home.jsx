import AwardCategories from './AwardCategories';
import HeroSection from './HeroSection';
import Initiatives from './Initiatives';
import PMQuoteSection from './PmQuoteSection';
import Stats from './Stats';
import VideoSection from './VideoSection';
import { heroData, videoData } from './homeData';
import InfluentialCreatorSection from './influentialCreatorSection';
import CreatorMovement from './CreatorMovement';
import TermsConditions from './TermsConditions';

export default function Home() {
  return (
    <div className="w-full flex flex-col">
      <HeroSection data={heroData} />
      <VideoSection data={videoData} />
      <Stats/>
      <PMQuoteSection/>
      <Initiatives/>
      <AwardCategories/>
      <CreatorMovement />
      <InfluentialCreatorSection/>
      <TermsConditions />
    </div>
  );
}
