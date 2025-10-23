import OurValues from "./Values";
import Banner from "./Banner";
import BestSellings from "./BestSellingProducts";

export function HomePage() {
  return (
    <div className="home-page">
      <Banner />
      <OurValues />
      <BestSellings />
    </div>
  );
}
