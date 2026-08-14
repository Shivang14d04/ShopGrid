import React from "react";

const EcommerceIllustration = ({ className = "", style = {} }) => {
  return (
    <svg
      viewBox="0 0 520 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: "100%", height: "auto", maxWidth: "380px", ...style }}
    >
      <defs>
        <linearGradient id="illBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF4ED" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FCE9DF" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="illPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F47752" />
          <stop offset="100%" stopColor="#E76F51" />
        </linearGradient>
        <filter id="illShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#292524" floodOpacity="0.06" />
        </filter>
        <filter id="heartShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#F47752" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Background Soft Glow Circles */}
      <circle cx="260" cy="220" r="150" fill="url(#illBgGrad)" />

      {/* Ground Soft Shadows */}
      <ellipse cx="260" cy="380" rx="190" ry="14" fill="#000000" fillOpacity="0.05" />
      <ellipse cx="110" cy="378" rx="50" ry="8" fill="#000000" fillOpacity="0.04" />
      <ellipse cx="380" cy="380" rx="35" ry="6" fill="#000000" fillOpacity="0.06" />

      {/* Background Plant Foliage Left & Right */}
      <path d="M85 365 C60 330 65 290 85 270 C95 310 90 350 85 365 Z" fill="#FCE9DF" />
      <path d="M100 365 C85 320 100 275 120 260 C125 305 115 345 100 365 Z" fill="#F4A261" fillOpacity="0.35" />
      <path d="M435 365 C455 330 450 290 435 270 C425 310 430 350 435 365 Z" fill="#FCE9DF" />

      {/* ── 1. Shopping Cart (Left side) ── */}
      <g stroke="#292524" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* Cart Frame */}
        <path d="M50 310 L68 310 L85 360 L140 360 L152 320 L72 320" stroke="#78716C" strokeWidth="2.5" />
        {/* Grid lines inside cart */}
        <path d="M88 335 H147" stroke="#78716C" strokeWidth="1.5" />
        <path d="M105 320 V360" stroke="#78716C" strokeWidth="1.5" />
        <path d="M125 320 V360" stroke="#78716C" strokeWidth="1.5" />
        {/* Cart Wheels */}
        <circle cx="92" cy="372" r="5" fill="#292524" stroke="none" />
        <circle cx="135" cy="372" r="5" fill="#292524" stroke="none" />
      </g>
      {/* Items inside Cart */}
      <rect x="95" y="295" width="28" height="30" rx="4" fill="#F47752" />
      <rect x="115" y="302" width="24" height="22" rx="4" fill="#F4A261" />

      {/* ── 2. Mobile Store Frame (Center) ── */}
      <g filter="url(#illShadow)">
        {/* Outer Phone Shell */}
        <rect x="195" y="70" width="170" height="300" rx="24" fill="#FFFFFF" stroke="#EFE3DA" strokeWidth="3" />
        
        {/* Notch */}
        <rect x="250" y="80" width="60" height="6" rx="3" fill="#EFE3DA" />

        {/* Store Awning Roof (Red & Peach striped awning) */}
        <path d="M192 106 Q280 106 368 106 L368 126 C358 132 348 132 338 126 C328 132 318 132 308 126 C298 132 288 132 278 126 C268 132 258 132 248 126 C238 132 228 132 218 126 C208 132 198 132 192 126 Z" fill="#F47752" />
        <path d="M218 106 L218 126 C228 132 238 132 248 126 L248 106 Z" fill="#FFF9F5" />
        <path d="M278 106 L278 126 C288 132 298 132 308 126 L308 106 Z" fill="#FFF9F5" />
        <path d="M338 106 L338 126 C348 132 358 132 368 126 L368 106 Z" fill="#FFF9F5" />

        {/* Product Cards inside Mobile Screen */}
        {/* Row 1: Headphone & Laptop */}
        <rect x="210" y="142" width="62" height="62" rx="10" fill="#FFF8F4" stroke="#F3E7DF" strokeWidth="1" />
        <path d="M232 165 C232 155 250 155 250 165" stroke="#F47752" strokeWidth="3" strokeLinecap="round" fill="none" />
        <rect x="229" y="163" width="6" height="10" rx="2" fill="#F47752" />
        <rect x="247" y="163" width="6" height="10" rx="2" fill="#F47752" />
        <rect x="220" y="194" width="42" height="4" rx="2" fill="#292524" fillOpacity="0.7" />

        <rect x="288" y="142" width="62" height="62" rx="10" fill="#FFF8F4" stroke="#F3E7DF" strokeWidth="1" />
        <rect x="306" y="156" width="26" height="18" rx="3" stroke="#292524" strokeWidth="2.5" fill="none" />
        <rect x="301" y="176" width="36" height="4" rx="2" fill="#292524" />
        <rect x="298" y="194" width="42" height="4" rx="2" fill="#F47752" />

        {/* Row 2: Shoe & Bag */}
        <rect x="210" y="214" width="62" height="62" rx="10" fill="#FFF8F4" stroke="#F3E7DF" strokeWidth="1" />
        <path d="M225 245 C230 235 245 235 255 245 H225 Z" fill="#292524" />
        <rect x="220" y="266" width="42" height="4" rx="2" fill="#292524" fillOpacity="0.7" />

        <rect x="288" y="214" width="62" height="62" rx="10" fill="#FFF8F4" stroke="#F3E7DF" strokeWidth="1" />
        <rect x="306" y="235" width="26" height="24" rx="4" fill="#F47752" />
        <path d="M313 235 C313 228 325 228 325 235" stroke="#F47752" strokeWidth="2" fill="none" />
        <rect x="298" y="266" width="42" height="4" rx="2" fill="#F47752" />

        {/* Add to Cart CTA Button inside phone */}
        <rect x="210" y="292" width="140" height="34" rx="10" fill="url(#illPrimaryGrad)" />
        <text x="280" y="313" fill="#FFFFFF" fontSize="11" fontWeight="800" textAnchor="middle" fontFamily="sans-serif" letterSpacing="0.5">
          ADD TO CART
        </text>
      </g>

      {/* ── 3. Floating Heart Comment Bubble (Top Right) ── */}
      <g filter="url(#heartShadow)">
        <circle cx="410" cy="140" r="22" fill="#FFFFFF" stroke="#FFF4ED" strokeWidth="2" />
        {/* Heart Icon */}
        <path d="M410 148 C402 140 398 132 404 126 C408 122 410 126 410 126 C410 126 412 122 416 126 C422 132 418 140 410 148 Z" fill="#F47752" />
      </g>

      {/* ── 4. Woman Shopping Character (Right) ── */}
      <g>
        {/* Character Hair */}
        <ellipse cx="380" cy="225" rx="15" ry="18" fill="#292524" />
        <circle cx="375" cy="215" r="9" fill="#292524" /> {/* Hair bun */}

        {/* Face & Neck */}
        <circle cx="384" cy="230" r="10" fill="#FCE9DF" />
        
        {/* Top (Orange Shirt) */}
        <path d="M368 250 C368 242 400 242 400 250 L395 300 H372 Z" fill="#F47752" />

        {/* Pants (Dark Charcoal) */}
        <path d="M372 300 L368 375 H380 L383 300" fill="#292524" />
        <path d="M395 300 L398 375 H386 L384 300" fill="#292524" />

        {/* Shoes */}
        <path d="M362 375 C362 370 380 370 380 378 H362 Z" fill="#FFFFFF" stroke="#292524" strokeWidth="1.5" />
        <path d="M398 375 C398 370 416 370 416 378 H398 Z" fill="#FFFFFF" stroke="#292524" strokeWidth="1.5" />

        {/* Right Arm pointing at phone */}
        <path d="M372 252 L345 285 L328 285" stroke="#F47752" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="325" cy="285" r="4" fill="#FCE9DF" />

        {/* Left Arm holding shopping bag */}
        <path d="M396 252 L410 280 L406 310" stroke="#F47752" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        {/* Shopping bag */}
        <rect x="398" y="305" width="26" height="30" rx="4" fill="#F4A261" />
        <path d="M405 305 C405 298 417 298 417 305" stroke="#292524" strokeWidth="2" fill="none" />
      </g>

      {/* ── 5. Floating Sparkle Stars (✦) ── */}
      <g fill="#F47752">
        {/* Star 1 */}
        <path d="M125 210 L128 217 L135 220 L128 223 L125 230 L122 223 L115 220 L122 217 Z" opacity="0.8" />
        {/* Star 2 */}
        <path d="M178 280 L180 285 L185 287 L180 289 L178 294 L176 289 L171 287 L176 285 Z" opacity="0.7" />
        {/* Star 3 */}
        <path d="M410 215 L412 220 L417 222 L412 224 L410 229 L408 224 L403 222 L408 220 Z" opacity="0.85" />
        {/* Star 4 (Top right) */}
        <path d="M410 180 L412 184 L416 186 L412 188 L410 192 L408 188 L404 186 L408 184 Z" fill="#F4A261" />
      </g>
    </svg>
  );
};

export default EcommerceIllustration;
