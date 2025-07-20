// src/components/Core/Hero.jsx
import '../../styles/Hero.css';
import HeroContent from './HeroContent';
import HeroSection from './HeroSection';
import HeroSectionPlaceholder from '../Placeholder/HeroSectionPlaceholder';

const Hero = () => {
  const isLoading = false;

  return (
    <main>
      {isLoading ? <HeroSectionPlaceholder /> : <HeroSection />}

      <div className="content mt-4 md:mt-8 flex flex-col gap-5 mb-[10rem]">
        <HeroContent title={'Top Choices'} />
        <HeroContent title={'Recommended Stations'} />
        <HeroContent title={'Browse All Stations'} />
      </div>
    </main>
  );
};

export default Hero;
