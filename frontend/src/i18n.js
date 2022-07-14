import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { register } from "timeago.js";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translations: {
        "Sign Up": "Sign Up",
        "Password mismatch": "Password mismatch",
        Username: "Username",
        "Display Name": "Display Name",
        Password: "Password",
        "Password Repeat": "Password Repeat",
        Login: "Login",
        Logout: "Logout",
        Users: "Users",
        Next: "next >",
        Previous: "< previous",
        "Load Failure": "Load Failure",
        "User not found": "User not found",
        Edit: "Edit",
        Save: "Save",
        Cancel: "Cancel",
        "Change Display Name": "Change Display Name",
        "My Profile": "My Profile",
        Hoaxify: "Hoaxify",
        "There are no hoaxes": "There are no hoaxes",
        "Load old hoaxes": "Load old hoaxes",
        "There are new hoaxes": "There are new hoaxes",
        "Write something here...": "Write something here...",
        "Delete Hoax": "Delete Hoax",
        "Are you sure to delete hoax?": "Are you sure to delete hoax?",
        "Delete My Account": "Delete My Account",
        "Are you sure to delete your account?":
          "Are you sure to delete your account?",
      },
    },
    tr: {
      translations: {
        "Sign Up": "Kayıt Ol",
        "Password mismatch": "Parolalar uyuşmuyor",
        Username: "Kullanıcı Adı",
        "Display Name": "Tercih Edilen İsim",
        Password: "Şifre",
        "Password Repeat": "Şifreyi Tekrarla",
        Login: "Giriş",
        Logout: "Çıkış",
        Users: "Kullanıcılar",
        Next: "sonraki >",
        Previous: "< önceki",
        "Load Failure": "Liste yüklenemedi",
        "User not found": "Kullanıcı bulunamadı",
        Edit: "Düzenle",
        Save: "Kaydet",
        Cancel: "İptal",
        "Change Display Name": "Tercih edilen ismi değiştir",
        "My Profile": "Profilim",
        Hoaxify: "Hoaxify",
        "There are no hoaxes": "Hoax bulunamadı",
        "Load old hoaxes": "Geçmiş Hoaxları getir",
        "There are new hoaxes": "Yeni Hoaxlar var",
        "Write something here...": "Birşeyler paylaş...",
        "Delete Hoax": "Hoax'u sil",
        "Are you sure to delete hoax?":
          "Hoax'u silmek istediğinden emin misin?",
        "Delete My Account": "Hesabımı sil",
        "Are you sure to delete your account?":
          "Hesabını silmek istediğinden emin misin?",
      },
    },
  },
  fallbackLng: "tr",
  ns: ["translations"],
  defaultNS: "translations",
  keySeperator: false,
  interpolation: {
    escapeValue: false,
    formatSeperator: ",",
  },
  react: {
    wait: true,
  },
});

const timeAgoTR = (number, index) => {
  return [
    ["az önce", "şimdi"],
    ["%s saniye önce", "%s saniye içinde"],
    ["1 dakika önce", "1 dakika içinde"],
    ["%s dakika önce", "%s dakika içinde"],
    ["1 saat önce", "1 saat içinde"],
    ["%s saat önce", "%s saat içinde"],
    ["1 gün önce", "1 gün içinde"],
    ["%s gün önce", "%s gün içinde"],
    ["1 hafta önce", "1 hafta içinde"],
    ["%s hafta önce", "%s hafta içinde"],
    ["1 ay önce", "1 ay içinde"],
    ["%s ay önce", "%s ay içinde"],
    ["1 yıl önce", "1 yıl içinde"],
    ["%s yıl önce", "%s yıl içinde"],
  ][index];
};
register("tr", timeAgoTR);
export default i18n;
