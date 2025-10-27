import { Box, Stack } from "@mui/material";

export default function Advertisement() {
  return (
    <div className="ads-frame">
      <Stack className="ads-container" direction="row">
        {/* LEFT SIDE - IMAGE */}
        <Box className="ads-image">
          <img src="/img/add1.jpg" alt="Perfume Sale" />
        </Box>

        {/* RIGHT SIDE - TEXT */}
        <Box className="ads-text">
          <h2>
            Perfume Year-End Sale! <br></br>Up to 50% OFF!
          </h2>
          <p>
            Discover an exquisite collection of premium perfumes at unbelievable
            prices during our exclusive Perfume Sale!
          </p>
          <a href="/products" className="ads-link">
            Shop Now
          </a>
        </Box>
      </Stack>
    </div>
  );
}
