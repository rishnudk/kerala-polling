import type { District } from "@/data/districts";

export interface KeralaDistrictMeta {
  id: District;
  malayalam: string;
  capital: string;
  path: string;
}

export const KERALA_DISTRICT_MAP: KeralaDistrictMeta[] = [
  {
    id: "Kasaragod",
    malayalam: "കാസർഗോഡ്",
    capital: "Kasaragod",
    path: "M154 28 L193 22 L214 35 L227 63 L220 93 L196 111 L162 107 L141 82 L144 52 Z",
  },
  {
    id: "Kannur",
    malayalam: "കണ്ണൂർ",
    capital: "Kannur",
    path: "M162 107 L196 111 L221 132 L229 169 L220 205 L198 223 L165 214 L144 189 L143 153 Z",
  },
  {
    id: "Wayanad",
    malayalam: "വയനാട്",
    capital: "Kalpetta",
    path: "M110 156 L142 148 L145 189 L165 214 L154 247 L130 264 L103 245 L93 203 Z",
  },
  {
    id: "Kozhikode",
    malayalam: "കോഴിക്കോട്",
    capital: "Kozhikode",
    path: "M154 247 L165 214 L198 223 L219 252 L214 291 L194 323 L164 328 L144 302 L145 270 Z",
  },
  {
    id: "Malappuram",
    malayalam: "മലപ്പുറം",
    capital: "Malappuram",
    path: "M144 302 L164 328 L195 325 L212 350 L208 392 L188 427 L157 433 L136 409 L134 349 Z",
  },
  {
    id: "Palakkad",
    malayalam: "പാലക്കാട്",
    capital: "Palakkad",
    path: "M195 325 L236 314 L261 330 L274 372 L264 416 L232 437 L208 392 L212 350 Z",
  },
  {
    id: "Thrissur",
    malayalam: "തൃശ്ശൂർ",
    capital: "Thrissur",
    path: "M136 409 L157 433 L188 427 L211 447 L214 486 L196 520 L166 526 L141 501 L133 463 Z",
  },
  {
    id: "Ernakulam",
    malayalam: "എറണാകുളം",
    capital: "Kakkanad",
    path: "M141 501 L166 526 L196 520 L214 548 L214 592 L194 621 L167 625 L145 603 L136 559 Z",
  },
  {
    id: "Idukki",
    malayalam: "ഇടുക്കി",
    capital: "Painavu",
    path: "M196 520 L231 505 L257 522 L268 561 L263 611 L234 647 L214 592 L214 548 Z",
  },
  {
    id: "Kottayam",
    malayalam: "കോട്ടയം",
    capital: "Kottayam",
    path: "M145 603 L167 625 L194 621 L210 650 L206 688 L186 717 L159 720 L143 690 Z",
  },
  {
    id: "Alappuzha",
    malayalam: "ആലപ്പുഴ",
    capital: "Alappuzha",
    path: "M121 615 L145 603 L143 690 L131 720 L114 740 L97 731 L99 686 Z",
  },
  {
    id: "Pathanamthitta",
    malayalam: "പത്തനംതിട്ട",
    capital: "Pathanamthitta",
    path: "M159 720 L186 717 L207 738 L209 776 L190 811 L163 813 L143 783 L144 745 Z",
  },
  {
    id: "Kollam",
    malayalam: "കൊല്ലം",
    capital: "Kollam",
    path: "M143 783 L163 813 L191 810 L211 832 L214 869 L197 903 L170 909 L149 882 L141 838 Z",
  },
  {
    id: "Thiruvananthapuram",
    malayalam: "തിരുവനന്തപുരം",
    capital: "Thiruvananthapuram",
    path: "M170 909 L197 903 L215 918 L225 949 L211 980 L184 997 L160 987 L151 952 Z",
  },
];
