export const CONSTITUENCIES: Record<string, string[]> = {
  Thiruvananthapuram: [
    "Vattiyoorkavu","Thrikkakara","Kazhakoottam","Kundara",
    "Kilimanoor","Nedumangad","Varkala","Attingal",
  ],
  Kollam: [
    "Kollam","Kunnathur","Kottarakkara","Pathanapuram","Punalur","Chadayamangalam",
  ],
  Pathanamthitta: ["Adoor","Thiruvalla","Ranni","Aranmula","Konni"],
  Alappuzha:      ["Cherthala","Alappuzha","Ambalappuzha","Harippad","Kayamkulam","Mavelikkara"],
  Kottayam:       ["Kottayam","Ettumanoor","Pala","Erattupetta","Kaduthuruthy"],
  Idukki:         ["Devikulam","Udumbanchola","Thodupuzha","Idukki","Peerumade"],
  Ernakulam:      ["Perumbavoor","Angamaly","Aluva","Kalamassery","Paravur","Ernakulam","Thrippunithura"],
  Thrissur:       ["Thrissur","Ollur","Chalakudy","Kodungallur","Kunnamkulam","Guruvayur"],
  Palakkad:       ["Palakkad","Thrithala","Ottapalam","Shoranur","Alathur","Chittur"],
  Malappuram:     ["Manjeri","Tirur","Tanur","Malappuram","Wandur","Kondotty"],
  Kozhikode:      ["Kozhikode North","Kozhikode South","Beypore","Kunnamangalam","Balussery","Vadakara"],
  Wayanad:        ["Mananthavady","Sulthanbathery","Kalpetta"],
  Kannur:         ["Kannur","Dharmadom","Thalassery","Irikkur","Azhikode","Peravoor"],
  Kasaragod:      ["Kasaragod","Manjeshwar","Udma","Kanhangad","Trikaripur"],
};

export const DISTRICTS = Object.keys(CONSTITUENCIES);