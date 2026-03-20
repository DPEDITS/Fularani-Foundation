import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Check,
  Sparkles,
  Share2,
  Download,
  Copy,
  CheckCheck,
} from "lucide-react";
import logoImg from "../../assets/logo.jpg";

const SuccessModal = ({ show, onClose, amount, formatCurrency, donorName, donorAvatar }) => {
  const [showShareSection, setShowShareSection] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  const displayName = donorName || "Generous Donor";
  const displayAmount = amount || 0;

  const shareCaption = `Thank you ${displayName} for your generous donation of ₹${displayAmount.toLocaleString("en-IN")} to Fularani Foundation! 🙏 Your support helps empower dreams and inspire humanity. Donate and support the community at kb.fularanifoundation.org 💝 #FularaniFoundation #Donate #EmpowerDreams`;

  const websiteUrl = "https://kb.fularanifoundation.org";
  // Generate premium share image using Canvas
  const generateShareImage = useCallback(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    // 1. Premium Dark Background (Deep Slate/Indigo)
    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1080);
    bgGrad.addColorStop(0, "#0f172a");     // slate-900
    bgGrad.addColorStop(0.5, "#1e1b4b");   // indigo-950
    bgGrad.addColorStop(1, "#020617");     // slate-950
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1080, 1080);

    // 2. Artistic Glowing Orbs for Depth
    const addGlow = (x, y, r, color) => {
      const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, color);
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };
    
    addGlow(150, 150, 700, "rgba(244, 63, 94, 0.15)");  // Rose top left glow
    addGlow(900, 800, 800, "rgba(139, 92, 246, 0.12)"); // Violet bottom right glow

    // 3. Subtle Grid Pattern Overlay (Premium texture)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 1080; i += 60) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1080); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1080, i); ctx.stroke();
    }

    // 4. Accent Border Top
    const barGrad = ctx.createLinearGradient(0, 0, 1080, 0);
    barGrad.addColorStop(0, "#f43f5e"); // rose-500
    barGrad.addColorStop(1, "#a855f7"); // purple-500
    ctx.fillStyle = barGrad;
    ctx.fillRect(0, 0, 1080, 12);

    // Helper: Load standard images
    const loadImg = (src) =>
      new Promise((resolve) => {
        if (!src) return resolve(null);
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
      });

    // Helper: Create fallback avatar
    const createInitialAvatar = (name) => {
      const c = document.createElement("canvas");
      c.width = 160;
      c.height = 160;
      const cx = c.getContext("2d");
      
      const avGrad = cx.createLinearGradient(0, 0, 160, 160);
      avGrad.addColorStop(0, "#f43f5e");
      avGrad.addColorStop(1, "#ec4899");
      cx.fillStyle = avGrad;
      cx.fillRect(0, 0, 160, 160);
      
      cx.fillStyle = "#ffffff";
      cx.font = "bold 72px 'Segoe UI', Arial, sans-serif";
      cx.textAlign = "center";
      cx.textBaseline = "middle";
      cx.fillText(name ? name.charAt(0).toUpperCase() : "D", 80, 85);
      return c;
    };

    // Helper: Load external avatar safely
    const loadAvatar = (src, name) =>
      new Promise((resolve) => {
        const fallback = createInitialAvatar(name);
        if (!src) return resolve(fallback);
        
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(fallback);
        img.src = src + (src.includes("?") ? "&" : "?") + "cb=" + new Date().getTime();
      });

    // Helper: Draw circular image with glowing stroke and object-fit: cover
    const drawCircularImage = (ctx, img, x, y, size) => {
      // Outer Glow shadow
      ctx.shadowColor = "rgba(244, 63, 94, 0.4)";
      ctx.shadowBlur = 30;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2 + 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Gradient border ring
      const ringGrad = ctx.createLinearGradient(x, y, x + size, y + size);
      ringGrad.addColorStop(0, "#f43f5e");
      ringGrad.addColorStop(1, "#a855f7");
      
      ctx.fillStyle = ringGrad;
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2 + 4, 0, Math.PI * 2);
      ctx.fill();

      // The image with object-fit: cover
      ctx.save();
      ctx.beginPath();
      ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
      ctx.clip();

      const imgRatio = img.width / img.height;
      let drawWidth = size;
      let drawHeight = size;
      let drawX = x;
      let drawY = y;

      if (imgRatio > 1) {
        // Landscape: scale height to fit, width extends
        drawWidth = size * imgRatio;
        drawX = x - (drawWidth - size) / 2;
      } else if (imgRatio < 1) {
        // Portrait: scale width to fit, height extends
        drawHeight = size / imgRatio;
        drawY = y - (drawHeight - size) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      ctx.restore();
    };

    Promise.all([loadImg(logoImg), loadAvatar(donorAvatar, displayName)]).then(([logo, avatar]) => {
      const size = 150;
      const y = 90;

      if (logo && avatar) {
        const colabSpace = 70;
        const totalWidth = size * 2 + colabSpace;
        const startX = (1080 - totalWidth) / 2;

        drawCircularImage(ctx, logo, startX, y, size);
        
        // Collab symbol (✕)
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 32px 'Segoe UI', Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("✕", startX + size + colabSpace / 2, y + size / 2);

        drawCircularImage(ctx, avatar, startX + size + colabSpace, y, size);
      } else if (logo) {
        drawCircularImage(ctx, logo, (1080 - size) / 2, y, size);
      }

      drawText(ctx);
    });

    function drawText(ctx) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // "FULARANI FOUNDATION" text
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 46px 'Segoe UI', Arial, sans-serif";
      // Adding letter spacing effect manually via padding isn't great in canvas, use uppercase and spacing
      const foundationText = "FULARANI FOUNDATION".split("").join(String.fromCharCode(8202));
      ctx.fillText(foundationText, 540, 290);

      // Tagline
      ctx.fillStyle = "#94a3b8"; // slate-400
      ctx.font = "600 20px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("EMPOWERING DREAMS, INSPIRING HUMANITY", 540, 340);

      // Decorative Divider
      const divGrad = ctx.createLinearGradient(300, 0, 780, 0);
      divGrad.addColorStop(0, "rgba(244,63,94,0)");
      divGrad.addColorStop(0.5, "rgba(244,63,94,0.6)");
      divGrad.addColorStop(1, "rgba(244,63,94,0)");
      ctx.strokeStyle = divGrad;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(250, 400);
      ctx.lineTo(830, 400);
      ctx.stroke();

      // Sparkle Icon & "IMMENSE GRATITUDE"
      ctx.fillStyle = "#f43f5e";
      ctx.font = "800 32px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("✨ IMMENSE GRATITUDE ✨", 540, 460);

      // Donor Name
      ctx.fillStyle = "#ffffff";
      ctx.font = "900 58px 'Segoe UI', Arial, sans-serif";
      const upperName = displayName.toUpperCase();
      const nameText = upperName.length > 20 ? upperName.substring(0, 18) + "..." : upperName;
      ctx.fillText(nameText, 540, 530);

      // "for your generous contribution of"
      ctx.fillStyle = "#94a3b8";
      ctx.font = "italic 400 26px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("for your generous contribution of", 540, 595);

      // Amount Card Background - Glassmorphism
      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
      ctx.shadowBlur = 40;
      ctx.beginPath();
      ctx.roundRect(260, 650, 560, 140, 30);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Amount Card glowing Border
      const cardBorderGrad = ctx.createLinearGradient(260, 650, 820, 790);
      cardBorderGrad.addColorStop(0, "rgba(244,63,94,0.5)");
      cardBorderGrad.addColorStop(1, "rgba(168,85,247,0.5)");
      ctx.strokeStyle = cardBorderGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(260, 650, 560, 140, 30);
      ctx.stroke();

      // Amount Text (Perfectly Centered Vertically and Horizontally inside the Box)
      // Box X starts at 260, width 560 -> Center X = 260 + (560 / 2) = 540
      // Box Y starts at 650, height 140 -> Center Y = 650 + (140 / 2) = 720
      const amtGrad = ctx.createLinearGradient(350, 0, 730, 0);
      amtGrad.addColorStop(0, "#fb7185"); // rose-400
      amtGrad.addColorStop(1, "#c084fc"); // purple-400
      ctx.fillStyle = amtGrad;
      ctx.font = "900 85px 'Segoe UI', Arial, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`₹${displayAmount.toLocaleString("en-IN")}`, 540, 720); 

      // Bottom Call to Action Text
      ctx.fillStyle = "#e2e8f0"; // slate-200
      ctx.font = "700 24px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("Your generosity will change lives!", 540, 860);

      // Bottom Message Box (Glass)
      ctx.fillStyle = "rgba(15, 23, 42, 0.6)"; // slate-900 transparent
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(140, 930, 800, 90, 25);
      ctx.fill();
      ctx.stroke();

      // Bottom accent bar highlight
      ctx.fillStyle = barGrad;
      ctx.beginPath();
      ctx.roundRect(140, 930, 800, 4, 4); 
      ctx.fill();

      // Website URL perfectly centered in bottom box
      // Center Y = 930 + (90 / 2) = 975
      ctx.fillStyle = "#ffffff";
      ctx.font = "800 28px 'Segoe UI', Arial, sans-serif";
      ctx.fillText("kb.fularanifoundation.org", 540, 975);

      // Convert drawing to an image URL for React to render
      const url = canvas.toDataURL("image/png");
      setShareImageUrl(url);
    }
  }, [displayName, displayAmount, donorAvatar]);

  useEffect(() => {
    if (show) {
      setShowShareSection(false);
      setCopied(false);
      setShareImageUrl(null);
      // Small delay for canvas generation so modal renders first
      const timer = setTimeout(() => generateShareImage(), 300);
      return () => clearTimeout(timer);
    }
  }, [show, generateShareImage]);

  const handleDownloadImage = () => {
    if (!shareImageUrl) return;
    const link = document.createElement("a");
    link.download = `fularani-donation-${displayName.replace(/\s+/g, "-").toLowerCase()}.png`;
    link.href = shareImageUrl;
    link.click();
  };

  // Helper to convert data URL to File
  const dataURLtoFile = (dataUrl, filename) => {
    try {
      const arr = dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      return new File([u8arr], filename, { type: mime });
    } catch (e) {
      console.error("File conversion error:", e);
      return null;
    }
  };

  const shareWithNativeApi = async (networkName) => {
    if (!shareImageUrl || !navigator.share || !navigator.canShare) return false;

    // NOTE: On some platforms/browsers, sharing both 'files' and 'text' together 
    // might result in only the files being shared (e.g. Windows Share Target).

    try {
      const file = dataURLtoFile(shareImageUrl, "donation-share.png");
      if (!file) return false;

      const shareData = {
        files: [file],
        title: "Fularani Foundation Donation",
        text: shareCaption,
      };

      if (navigator.canShare(shareData)) {
        await navigator.share(shareData);
        return true;
      }
    } catch (err) {
      console.log(`Error sharing to ${networkName}:`, err);
      // If user cancelled, we return true to stop fallback
      if (err.name === "AbortError") return true;
    }
    return false;
  };

  const handleWhatsAppShare = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Mobile handles image transmission beautifully via native share
      const success = await shareWithNativeApi("WhatsApp");
      if (success) return;
    }

    let imageCopied = false;
    // DESKTOP: WhatsApp Web/App deep links do NOT support file attachments natively.
    // Solution: Copy the image to clipboard & download fallback, then deep link app.
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard && navigator.clipboard.write) {
        const response = await fetch(shareImageUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        imageCopied = true;
        alert("🖼️ Image copied to clipboard! Just hit Paste (Ctrl+V) in WhatsApp to attach it (the caption is already pre-filled).");
      } else {
        handleDownloadImage();
      }
    } catch (e) {
      handleDownloadImage();
    }

    // Only copy the caption if we didn't firmly lock the image into the clipboard just now
    if (!imageCopied) {
      await handleCopyCaption();
    }

    // Trigger WhatsApp Desktop App explicitly via custom URI scheme
    const url = `whatsapp://send?text=${encodeURIComponent(shareCaption)}`;
    window.location.href = url;

    // Fallback to Web if Desktop app is not installed
    setTimeout(() => {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareCaption)}`, "_blank");
    }, 1500);
  };

  const handleInstagramShare = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Bypassing native share sheet to target Instagram specifically:
    // Browsers cannot push files mathematically to Instagram via deep link.
    // We MUST download to camera roll -> Open IG Camera
    
    handleDownloadImage();
    await handleCopyCaption();

    if (isMobile) {
      alert("✨ Image saved & Caption copied! Select it from your gallery in Instagram.");
      
      // Try iOS Story Deep Link
      window.location.href = "instagram://story-camera";
      
      // Android Intent Fallback
      setTimeout(() => {
        if (/Android/i.test(navigator.userAgent)) {
          window.location.href = "intent://instagram.com/#Intent;package=com.instagram.android;scheme=https;end";
        }
      }, 1000);
    } else {
      window.open("https://www.instagram.com", "_blank");
      alert("✨ Image downloaded & Caption copied! Ready to post on Instagram.");
    }
  };

  const handleFacebookShare = async () => {
    // Try native share first to include image if possible
    const shared = await shareWithNativeApi("Facebook");
    if (shared) return;

    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(websiteUrl)}&quote=${encodeURIComponent(shareCaption)}`;
    window.open(url, "_blank");
  };

  const handleTwitterShare = async () => {
    // Try native share first to include image if possible
    const shared = await shareWithNativeApi("X");
    if (shared) return;

    const text = shareCaption.substring(0, 270);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(websiteUrl)}`;
    window.open(url, "_blank");
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(shareCaption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = shareCaption;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    await shareWithNativeApi("Native");
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl animate-in zoom-in-95 duration-300 text-center relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Animated background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-rose-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-100 rounded-full blur-3xl opacity-50 animate-pulse delay-500"></div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 md:p-8 relative z-10 custom-scrollbar flex-1 pb-6">
          {/* Success Icon with Animation */}
          <div className="relative mx-auto w-16 h-16 md:w-20 md:h-20 mb-4 md:mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-full h-full bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
              <Check size={32} className="text-white" strokeWidth={3} />
            </div>
            {/* Sparkles */}
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
            <Sparkles className="absolute -bottom-1 -left-2 w-5 h-5 text-yellow-400 animate-bounce delay-100" />
          </div>

          <h2 className="text-2xl font-bold text-[#1d1d1f] mb-1">
            Thank You! 🎉
          </h2>
          <p className="text-[#86868b] text-sm mb-6">Your donation was successful</p>

          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 md:p-6 mb-6 border border-rose-100">
            <p className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-1">
              Amount Donated
            </p>
            <p className="text-3xl md:text-4xl font-bold text-[#1d1d1f]">
              {formatCurrency(amount)}
            </p>
          </div>

          <p className="text-sm text-[#86868b] mb-6 leading-relaxed">
            Your generosity will make a real difference in someone's life. A
            receipt has been sent to your email.
          </p>

          {/* Share Section Content */}
          {showShareSection && (
            <div className="animate-in slide-in-from-bottom-4 duration-300 pb-20">
              {/* Share Image Preview */}
              {shareImageUrl && (
                <div className="mb-5 rounded-2xl overflow-hidden border border-rose-100 shadow-md">
                  <img
                    src={shareImageUrl}
                    alt="Share card"
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Caption Preview */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5 text-left border border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Caption
                  </p>
                  <button
                    onClick={handleCopyCaption}
                    className="text-[10px] font-bold text-rose-500 hover:text-rose-600 flex items-center gap-1"
                  >
                    {copied ? <CheckCheck size={12} /> : <Copy size={12} />}
                    {copied ? "COPIED" : "COPY"}
                  </button>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {shareCaption}
                </p>
              </div>

              {/* Share Buttons Grid */}
              <div className="grid grid-cols-5 gap-2 mb-4">
                {/* WhatsApp */}
                <button
                  onClick={handleWhatsAppShare}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-green-50 transition-all group active:scale-95"
                  title="Share on WhatsApp"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shadow-md shadow-[#25D366]/20 group-hover:shadow-lg group-hover:shadow-[#25D366]/30 transition-all group-hover:-translate-y-0.5">
                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-semibold text-gray-500">WhatsApp</span>
                </button>

                {/* Facebook */}
                <button
                  onClick={handleFacebookShare}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-blue-50 transition-all group active:scale-95"
                  title="Share on Facebook"
                >
                  <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center shadow-md shadow-[#1877F2]/20 group-hover:shadow-lg group-hover:shadow-[#1877F2]/30 transition-all group-hover:-translate-y-0.5">
                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-semibold text-gray-500">Facebook</span>
                </button>

                {/* X (Twitter) */}
                <button
                  onClick={handleTwitterShare}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-all group active:scale-95"
                  title="Share on X"
                >
                  <div className="w-10 h-10 rounded-full bg-[#000000] flex items-center justify-center shadow-md shadow-black/20 group-hover:shadow-lg group-hover:shadow-black/30 transition-all group-hover:-translate-y-0.5">
                    <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-semibold text-gray-500">X</span>
                </button>

                {/* Instagram */}
                <button
                  onClick={handleInstagramShare}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-pink-50 transition-all group active:scale-95"
                  title="Share on Instagram"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shadow-md shadow-pink-500/20 group-hover:shadow-lg group-hover:shadow-pink-500/30 transition-all group-hover:-translate-y-0.5"
                    style={{
                      background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <span className="text-[9px] font-semibold text-gray-500">Instagram</span>
                </button>

                {/* More Options */}
                {typeof navigator !== "undefined" && navigator.share && (
                  <button
                    onClick={handleNativeShare}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-100 transition-all group active:scale-95"
                    title="More options"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:-translate-y-0.5">
                      <Share2 size={20} className="text-gray-600" />
                    </div>
                    <span className="text-[9px] font-semibold text-gray-500">More</span>
                  </button>
                )}
              </div>

              {/* Download Image Button */}
              <button
                onClick={handleDownloadImage}
                className="w-full py-3 mb-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-amber-400/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Download Share Image
              </button>
            </div>
          )}

          {!showShareSection && (
            <div className="flex flex-col gap-3 mb-2">
              <button
                onClick={() => setShowShareSection(true)}
                className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white rounded-2xl font-bold text-base transition-all shadow-lg shadow-violet-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Share2 size={18} />
                Share Your Impact
              </button>
              <button
                onClick={onClose}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-bold text-base transition-all shadow-lg shadow-rose-500/20 active:scale-95"
              >
                Continue to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Sticky Footer for Share Section Buttons */}
        {showShareSection && (
          <div className="p-4 bg-white border-t border-gray-100 flex gap-2 w-full z-20 shrink-0">
            <button
              onClick={() => setShowShareSection(false)}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all active:scale-95"
            >
              Back
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-rose-500/20 active:scale-95"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessModal;
           