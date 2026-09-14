import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Copy,
  ExternalLink,
  FileText,
  Flame,
  Gift,
  Github,
  Globe2,
  ListChecks,
  Search,
  Scale,
  Share2,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import hackathonImage from "@/assets/event-hackathon-ai.jpg";
import vibeImage from "@/assets/event-vibe-coding-summit.jpg";
import retroImage from "@/assets/event-retrohack.jpg";
import chillImage from "@/assets/event-chill-code-workshop.jpg";
import territoryQuestImage from "@/assets/quests/quest-territory-control.png";
import salesReviewQuestImage from "@/assets/quests/quest-ai-sales-review.png";
import signalReportQuestImage from "@/assets/quests/quest-social-signal-report.png";
import openClawLandingImage from "@/assets/quests/openclaw-landing.png";
import openClawCommunityImage from "@/assets/quests/openclaw-community.png";
import openClawAgentControlImage from "@/assets/quests/openclaw-agent-control.png";
import openClawLobsterImage from "@/assets/quests/openclaw-lobster.png";
import openClawBrandMark from "@/assets/quests/openclaw-brand-mark.jpeg";
import leaderHoangNamAvatar from "@/assets/quests/leader-hoang-nam.avif";
import leaderMinhChauAvatar from "@/assets/quests/leader-minh-chau.avif";
import leaderLinhNguyenAvatar from "@/assets/quests/leader-linh-nguyen.avif";
import leaderboardMemberTwoAvatar from "@/assets/quests/leaderboard-member-002.png";
import leaderYouAvatar from "@/assets/quests/leader-you.avif";
import communityForumImage from "@/assets/quests/community/nghien-ai-community-forum.jpg";
import partnerOpenAiLogo from "@/assets/quests/partners/openai.svg";
import partnerClaudeLogo from "@/assets/quests/partners/claude-color.svg";
import partnerGeminiLogo from "@/assets/quests/partners/gemini-color.svg";
import partnerNvidiaLogo from "@/assets/quests/partners/nvidia-color.svg";
import partnerAwsLogo from "@/assets/quests/partners/aws-color.svg";
import partnerDeepseekLogo from "@/assets/quests/partners/deepseek-color.svg";
import { useQuestMotion } from "@/features/quests/useQuestMotion";
import { useQuestHubMotion } from "@/features/quests/useQuestHubMotion";
import { QuestLeaderboardHeatmap } from "@/features/quests/QuestLeaderboardHeatmap";
import {
  createSampleLeaderboardMembers,
  type LeaderboardPeriod,
} from "@/features/quests/leaderboardHeatmap";
import {
  formatAccessibleCountdown,
  formatCompactCountdown,
  formatFeaturedCountdown,
  getCountdownParts,
  getCountdownTarget,
  getNextFlipDelay,
  getQuestPhase,
  type QuestPhase,
  type QuestSchedule,
} from "@/features/quests/questHubTime";
import "../styles/quest.css";

type Quest = {
  slug: string;
  title: string;
  partner: string;
  category: string;
  level: string;
  badge: string;
  prize: string;
  participants: string;
  ends: string;
  startsAt?: string;
  endsAt?: string;
  urgency: string;
  description: string;
  images: string[];
  accent: string;
};

type TaskKind =
  | "quiz"
  | "external-link"
  | "account-id"
  | "link-submission"
  | "social-share"
  | "writing"
  | "community-feedback"
  | "upload"
  | "vote"
  | "check-in"
  | "lucky-draw"
  | "badge";
type TaskStatus = "done" | "submitted";

type TaskSubmission = {
  status?: TaskStatus;
  choice?: string;
  opened?: boolean;
  url?: string;
  shareChannel?: "x" | "facebook";
  text?: string;
  accountId?: string;
  fileName?: string;
  vote?: string;
  checkInCode?: string;
  drawResult?: string;
};

type TaskDefinition = {
  id: number;
  kind: TaskKind;
  title: string;
  summary: string;
  detail: string;
  reward: string;
  requirements?: string[];
  isBonus?: boolean;
  placeholder?: string;
  label?: string;
  minLength?: number;
  options?: string[];
  correctOption?: number;
  url?: string;
  shareTargets?: { x: string; facebook: string };
  accept?: string;
  maxFileSizeMb?: number;
  drawResults?: string[];
};

type QuestLocalState = {
  tasks: Record<number, TaskSubmission>;
};

const quests: Quest[] = [
  {
    slug: "build-your-first-ai-agent",
    title: "Build your first AI Agent",
    partner: "Nghiên AI × OpenClaw",
    category: "Vibe coding",
    level: "Dễ làm",
    badge: "Cộng điểm người mới",
    prize: "15.000.000đ",
    participants: "1.284",
    ends: "2 ngày 14 giờ",
    startsAt: "2026-09-09T00:00:00+07:00",
    endsAt: "2026-09-19T21:00:00+07:00",
    urgency: "Đang tăng tốc",
    description:
      "Tạo một agent xử lý một việc cụ thể, rồi chia sẻ cách bạn làm.",
    images: [
      openClawLandingImage,
      openClawCommunityImage,
      openClawAgentControlImage,
      openClawLobsterImage,
    ],
    accent: "orange",
  },
  {
    slug: "prompt-to-product",
    title: "Prompt → Product Sprint",
    partner: "Nghiên AI × Diaflow",
    category: "Build in public",
    level: "Trung bình",
    badge: "Quest nổi bật",
    prize: "10.000.000đ",
    participants: "842",
    ends: "5 ngày 08 giờ",
    urgency: "Còn 38 suất mentor",
    description:
      "Biến một ý tưởng thành prototype có thể chạm, test và demo trong 7 ngày.",
    images: [vibeImage, retroImage, hackathonImage],
    accent: "blue",
  },
  {
    slug: "ai-content-lab",
    title: "AI Content Lab",
    partner: "Nghiên AI Academy",
    category: "Content",
    level: "Dễ làm",
    badge: "Phù hợp người mới",
    prize: "5.000.000đ",
    participants: "2.106",
    ends: "Đã kết thúc",
    urgency: "Đã có 312 bài",
    description:
      "Thử nghiệm một format nội dung mới với AI và biến insight thành một bài đăng có ích.",
    images: [chillImage, hackathonImage, vibeImage],
    accent: "purple",
  },
];

const pulseMessages = [
  ["Minh Anh", "vừa hoàn thành bước 2", "15 giây trước"],
  ["Hoàng Nam", "đã nhận huy hiệu Người mở đường", "43 giây trước"],
  ["Linh Chi", "vừa tham gia quest này", "1 phút trước"],
  ["Quỳnh Nhi", "đã gửi link demo", "2 phút trước"],
];

const campaignTasks: TaskDefinition[] = [
  {
    id: 1,
    kind: "quiz",
    title: "Chọn việc cần làm",
    summary: "Bắt đầu từ một việc cụ thể.",
    detail:
      "Một agent hữu ích luôn có một việc rõ ràng để xử lý. Chọn nguyên tắc đúng trước khi bắt đầu build.",
    requirements: [
      "Chọn một trong bốn đáp án; chỉ có một đáp án đúng.",
      "Nếu chọn sai, bạn sẽ nhận được gợi ý và có thể chọn lại ngay.",
    ],
    reward: "+100 XP",
    options: [
      "Chọn một việc lặp lại, có đầu vào và kết quả rõ ràng.",
      "Làm agent càng nhiều tính năng càng tốt ngay từ đầu.",
      "Chỉ chọn việc nghe thật mới lạ, dù chưa biết dùng ở đâu.",
      "Đợi có kế hoạch hoàn hảo rồi mới bắt đầu.",
    ],
    correctOption: 0,
  },
  {
    id: 2,
    kind: "external-link",
    title: "Xem hướng dẫn OpenClaw",
    summary: "Nắm cách tạo agent với OpenClaw.",
    detail:
      "Mở OpenClaw Docs để hiểu cách thiết lập agent và chạy thử workflow đầu tiên. Sau đó quay lại xác nhận bạn đã xem.",
    requirements: [
      "Đọc phần bắt đầu nhanh trong Docs.",
      "Tự xác nhận sau khi đã xem; bản thử không theo dõi thời gian đọc hay hoạt động trên Docs.",
    ],
    reward: "+100 XP",
    url: "https://docs.openclaw.ai/",
  },
  {
    id: 3,
    kind: "link-submission",
    title: "Tạo agent",
    summary: "Nộp link agent hoặc video demo.",
    detail:
      "Tạo một agent xử lý một việc cụ thể, chẳng hạn tóm tắt email, chuẩn bị lịch họp hoặc phân loại yêu cầu. Nộp một link để người khác xem agent chạy thế nào.",
    requirements: [
      "Link có thể là demo, portfolio, GitHub hoặc video quay màn hình.",
      "Video nên cho thấy đầu vào, agent xử lý và kết quả đầu ra.",
      "Kiểm tra quyền truy cập của link trước khi nộp.",
    ],
    reward: "+500 XP",
    label: "Link demo hoặc video",
    placeholder: "https://...",
  },
  {
    id: 4,
    kind: "social-share",
    title: "Chia sẻ bài làm",
    summary: "Đăng bài rồi dán link post của bạn.",
    detail:
      "Chọn X hoặc Facebook để chia sẻ campaign, sau đó đăng một post ngắn về agent của bạn. Khi quay lại, dán link post chính chủ làm bằng chứng.",
    requirements: [
      "Post cần có ít nhất: agent làm gì và một ảnh hoặc link demo.",
      "Chỉ nhận URL x.com, twitter.com hoặc facebook.com phù hợp với kênh bạn đã chọn.",
      "Hệ thống không tự kiểm tra việc bạn đã share thành công.",
    ],
    reward: "+300 XP",
    label: "Link post X hoặc Facebook của bạn",
    placeholder: "https://x.com/... hoặc https://facebook.com/...",
    shareTargets: {
      x: "https://x.com/nghienaivn/status/2097540367344435293",
      facebook:
        "https://www.facebook.com/groups/aiartworksvn/permalink/4502535769959272",
    },
  },
  {
    id: 5,
    kind: "community-feedback",
    title: "Góp ý cho một bài",
    summary: "Để lại một nhận xét có ích.",
    detail:
      "Chọn một bài làm khác trong cộng đồng và để lại nhận xét có thể giúp tác giả cải thiện bản demo, cách trình bày hoặc use case.",
    requirements: [
      "Nêu một điểm bạn thấy hiệu quả và một đề xuất cụ thể.",
      "Dán link trực tiếp đến comment hoặc review của bạn.",
      "Không dùng nhận xét một dòng chung chung như “hay quá” hoặc “đỉnh”.",
    ],
    reward: "+100 XP",
    label: "Link comment hoặc review",
    placeholder: "https://...",
  },
  {
    id: 6,
    kind: "vote",
    title: "Khảo sát OpenClaw",
    summary: "Chọn tính năng bạn thấy hữu ích nhất.",
    detail:
      "Câu trả lời này giúp Nghiên AI biết nên làm thêm demo và hướng dẫn cho tính năng nào của OpenClaw. Không có đáp án đúng hoặc sai.",
    requirements: [
      "Chọn một tính năng gần nhất với nhu cầu của bạn.",
      "Mỗi trình duyệt lưu một câu trả lời local trong bản thử.",
      "Câu trả lời không được gửi sang OpenClaw hoặc Nghiên AI ở bản này.",
    ],
    reward: "+50 XP",
    options: [
      "Chạy agent trên máy cá nhân",
      "Biến chat thành workflow",
      "Kết nối agent với công cụ khác",
      "Tôi muốn xem thêm demo trước khi chọn",
    ],
  },
  {
    id: 7,
    kind: "upload",
    title: "Tải ảnh proof",
    summary: "Thêm ảnh agent hoặc workflow của bạn.",
    detail:
      "Tải một ảnh chụp màn hình cho thấy agent, workflow hoặc kết quả đầu ra. Đây là proof bổ sung cho link demo ở bước 3.",
    requirements: [
      "Chấp nhận PNG, JPG hoặc WEBP; tối đa 10 MB.",
      "Che khóa API, dữ liệu khách hàng và thông tin cá nhân trước khi tải.",
      "Bản thử không upload ảnh lên máy chủ; chỉ lưu tên file trong trạng thái local.",
    ],
    reward: "+150 XP",
    label: "Ảnh proof",
    accept: "image/png,image/jpeg,image/webp",
    maxFileSizeMb: 10,
  },
  {
    id: 8,
    kind: "lucky-draw",
    title: "Rút thăm may mắn",
    summary: "Một lượt rút thử sau khi xong nhiệm vụ chính.",
    detail:
      "Sau khi hoàn tất các nhiệm vụ chính, bạn có một lượt rút thăm mang tính gamification. Kết quả được tạo ngẫu nhiên ngay trên trình duyệt.",
    requirements: [
      "Chỉ mở khi bạn đã hoàn thành hoặc nộp đủ bảy nhiệm vụ chính.",
      "Kết quả trong bản thử là mô phỏng local, không phải cam kết quà tặng thật.",
      "Lucky Draw không ảnh hưởng tiến độ, xét giải hoặc huy hiệu Người mở đường.",
    ],
    reward: "Rút 1 lượt",
    isBonus: true,
    drawResults: [
      "+50 XP thử nghiệm",
      "Huy hiệu May mắn (mô phỏng)",
      "Thêm 1 lượt vote (mô phỏng)",
      "Chưa trúng lượt này — tiếp tục hoàn thành quest khác nhé",
    ],
  },
  {
    id: 9,
    kind: "badge",
    title: "Nhận huy hiệu",
    summary: "Mở sau khi 7 nhiệm vụ chính đã xong.",
    detail:
      "Khi bảy nhiệm vụ chính đã hoàn thành hoặc đã nộp, bạn có thể nhận huy hiệu Người mở đường. Lucky Draw là nhiệm vụ thưởng, không phải điều kiện.",
    requirements: [
      "Hoàn thành quiz, Docs, demo, share, feedback, khảo sát và ảnh proof.",
      "Các bài nộp link vẫn đang ở trạng thái mô phỏng local trong bản thử này.",
    ],
    reward: "+200 XP",
  },
];

const relatedQuests = [
  {
    image: territoryQuestImage,
    label: "Chiến lược",
    title: "Agent Territory",
    description: "Giao cho agent quyền sở hữu một vùng việc lặp lại.",
    status: "Sắp mở",
    opensIn: "3 ngày 08 giờ",
  },
  {
    image: salesReviewQuestImage,
    label: "Dữ liệu",
    title: "AI Sales Review",
    description:
      "Biến dữ liệu bán hàng rời rạc thành một buổi review có quyết định.",
    status: "Sắp mở",
    opensIn: "5 ngày 12 giờ",
  },
  {
    image: signalReportQuestImage,
    label: "Nội dung",
    title: "Social Signal Report",
    description:
      "Đọc tín hiệu từ nội dung để tìm format tăng trưởng tiếp theo.",
    status: "Sắp mở",
    opensIn: "8 ngày 04 giờ",
  },
];

type HubCatalogItem = QuestSchedule & {
  title: string;
  description: string;
  image: string;
  status: QuestPhase;
  prize: string;
  xp: string;
  incentive: string;
  participants?: string;
};

/** Hub-only campaign cards. Kept separate so the existing campaign detail stays untouched. */
const hubRelatedQuests: HubCatalogItem[] = [
  {
    image: territoryQuestImage,
    title: "Agent Territory",
    description: "Giao cho agent quyền sở hữu một vùng việc lặp lại.",
    status: "Đang diễn ra",
    endsAt: "2026-09-18T03:00:00+07:00",
    participants: "672 đã tham gia",
    prize: "10.000.000đ giải thưởng",
    xp: "1.200 XP có thể đạt",
    incentive: "+200 XP cho người mới",
  },
  {
    image: salesReviewQuestImage,
    title: "AI Sales Review",
    description: "Biến dữ liệu bán hàng rời rạc thành một buổi review có quyết định.",
    status: "Sắp mở",
    startsAt: "2026-09-19T03:00:00+07:00",
    endsAt: "2026-10-03T03:00:00+07:00",
    prize: "8.000.000đ giải thưởng",
    xp: "1.000 XP có thể đạt",
    incentive: "Có mẫu báo cáo",
  },
  {
    image: signalReportQuestImage,
    title: "Social Signal Report",
    description: "Đọc tín hiệu từ nội dung để tìm format tăng trưởng tiếp theo.",
    status: "Sắp mở",
    startsAt: "2026-09-21T19:00:00+07:00",
    endsAt: "2026-10-05T19:00:00+07:00",
    prize: "6.000.000đ giải thưởng",
    xp: "900 XP có thể đạt",
    incentive: "Giải nội dung nổi bật",
  },
];

type DossierColumn = "primary" | "secondary";
type DossierItem = {
  id: string;
  column: DossierColumn;
  title: string;
  icon: LucideIcon;
  intro?: string;
  items?: string[];
};

const campaignDossier: DossierItem[] = [
  {
    id: "intro",
    column: "primary",
    title: "Giới thiệu chiến dịch",
    icon: Target,
    intro:
      "Build your first AI Agent là một campaign thực hành: chọn một việc nhỏ, làm agent xử lý việc đó, rồi chia sẻ lại cách bạn đã làm để cộng đồng học cùng nhau.",
    items: [
      "Dành cho người mới lẫn người đã từng thử làm agent.",
      "Ưu tiên một bài làm rõ việc, chạy được và dễ kiểm chứng.",
      "Bạn có thể dùng OpenClaw hoặc công cụ phù hợp với bài toán của mình.",
    ],
  },
  {
    id: "outcome",
    column: "primary",
    title: "Mục tiêu & đầu ra",
    icon: ListChecks,
    intro:
      "Kết thúc quest, bạn cần có một agent giải được một việc cụ thể thay vì chỉ là ý tưởng hoặc prompt mẫu.",
    items: [
      "Demo hoặc video cho thấy agent đang chạy.",
      "Mô tả ngắn: agent làm gì, dành cho ai và dùng công cụ nào.",
      "Một bài chia sẻ để người khác có thể xem và học lại quy trình.",
    ],
  },
  {
    id: "eligibility",
    column: "primary",
    title: "Điều kiện tham gia",
    icon: Users,
    items: [
      "Không yêu cầu kinh nghiệm lập trình hoặc dự án có quy mô lớn.",
      "Mỗi bài chỉ cần giải một việc rõ ràng trong công việc hoặc đời sống.",
      "Link nộp bài phải mở được để cộng đồng xem; không đưa dữ liệu nhạy cảm vào demo.",
    ],
  },
  {
    id: "submission",
    column: "primary",
    title: "Bài nộp hợp lệ",
    icon: FileText,
    items: [
      "Link demo, portfolio hoặc video quay agent đang hoạt động.",
      "Link bài chia sẻ của bạn trên X hoặc Facebook.",
      "Một link comment/review có ích cho bài làm của người khác.",
    ],
  },
  {
    id: "schedule",
    column: "secondary",
    title: "Lịch trình & mốc quan trọng",
    icon: CalendarDays,
    items: [
      "09/09: mở quest và đăng hướng dẫn.",
      "19/09, 21:00 (GMT+7): hạn nộp demo, bài chia sẻ và link góp ý.",
      "20–22/09: cộng đồng xem, phản hồi và bình chọn bài làm.",
      "24/09: công bố kết quả và huy hiệu.",
    ],
  },
  {
    id: "prizes",
    column: "secondary",
    title: "Giải thưởng & cách tính điểm",
    icon: Scale,
    intro:
      "Tổng giải thưởng của campaign là 15.000.000đ. Điểm được dùng để theo dõi mức độ hoàn thành và xếp hạng trong quest.",
    items: [
      "50%: agent hữu dụng, có đầu vào và đầu ra dễ hiểu.",
      "25%: bài chia sẻ rõ cách làm và điều đã học.",
      "15%: phản hồi xây dựng cho cộng đồng.",
      "10%: hoàn tất đủ các bước trong quest.",
    ],
  },
  {
    id: "notes",
    column: "secondary",
    title: "Lưu ý khi nộp",
    icon: Check,
    items: [
      "Kiểm tra quyền truy cập của mọi link trước khi gửi.",
      "Nên quay video ngắn nếu demo cần đăng nhập hoặc chạy trên máy cá nhân.",
      "Chỉ gửi nội dung bạn có quyền chia sẻ; che thông tin cá nhân, khóa API và dữ liệu khách hàng.",
    ],
  },
  {
    id: "support",
    column: "secondary",
    title: "Hỗ trợ",
    icon: Globe2,
    intro:
      "Bắt đầu từ OpenClaw Docs, sau đó dùng GitHub nếu cần xem mã nguồn hoặc báo lỗi. Các link này nằm ở dải OpenClaw phía trên.",
  },
];

function Countdown({ ends }: { ends: string }) {
  return (
    <span className="quest-countdown">
      <Clock3 size={15} /> {ends}
    </span>
  );
}

function useQuestHubClock() {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    let timer: number | undefined;

    const stop = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };
    const schedule = () => {
      stop();
      if (document.visibilityState === "hidden") return;
      const delay = 1_000 - (Date.now() % 1_000) + 8;
      timer = window.setTimeout(() => {
        setNowMs(Date.now());
        schedule();
      }, delay);
    };
    const syncVisibility = () => {
      stop();
      if (document.visibilityState === "visible") {
        setNowMs(Date.now());
        schedule();
      }
    };

    schedule();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, []);

  return nowMs;
}

function QuestCountdown({
  nowMs,
  schedule,
  variant,
  phase: phaseOverride,
}: {
  nowMs: number;
  schedule: QuestSchedule;
  variant: "featured" | "compact";
  phase?: QuestPhase;
}) {
  const phase = phaseOverride ?? getQuestPhase(schedule, nowMs);
  const parts = getCountdownParts(getCountdownTarget(schedule, phase), nowMs);

  if (phase === "Đã kết thúc") {
    return variant === "featured" ? (
      <div className="hub-featured__time hub-live-countdown" role="timer" aria-live="off">
        <Clock3 size={18} />
        <strong>Đã kết thúc</strong>
      </div>
    ) : (
      <span className="hub-live-countdown" role="timer" aria-live="off">
        <Clock3 size={14} /> Đã kết thúc
      </span>
    );
  }

  const prefix = phase === "Sắp mở" ? "Mở sau" : "Còn";
  const accessibleText = `${prefix} ${formatAccessibleCountdown(parts)}`;

  if (variant === "featured") {
    return (
      <div className="hub-featured__time hub-live-countdown" role="timer" aria-live="off" aria-label={accessibleText}>
        <span className="hub-featured__time-label" aria-hidden="true">
          <Clock3 size={18} />
          {phase === "Sắp mở" ? "Mở sau" : "Còn lại"}
        </span>
        <strong aria-hidden="true">{formatFeaturedCountdown(parts)}</strong>
      </div>
    );
  }

  return (
    <span
      className={`hub-live-countdown${phase === "Sắp mở" ? " is-opening" : ""}`}
      role="timer"
      aria-live="off"
      aria-label={accessibleText}
    >
      <Clock3 size={14} aria-hidden="true" />
      <span aria-hidden="true">{prefix} {formatCompactCountdown(parts)}</span>
    </span>
  );
}

function PrizeFlipDisplay({ amount, reduceMotion }: { amount: string; reduceMotion: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [flipCycle, setFlipCycle] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || !isInView) return;
    let timer: number | undefined;

    const stop = () => {
      if (timer !== undefined) window.clearTimeout(timer);
      timer = undefined;
    };
    const scheduleNextFlip = () => {
      stop();
      if (document.visibilityState === "hidden") return;
      timer = window.setTimeout(() => {
        setFlipCycle((current) => current + 1);
        setIsFlipping(true);
        scheduleNextFlip();
      }, getNextFlipDelay(Date.now()) + 12);
    };
    const syncVisibility = () => {
      stop();
      if (document.visibilityState === "visible") {
        scheduleNextFlip();
      } else {
        setIsFlipping(false);
      }
    };

    scheduleNextFlip();
    document.addEventListener("visibilitychange", syncVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", syncVisibility);
    };
  }, [isInView, reduceMotion]);

  const characters = [...amount].map((character, index) => ({
    character,
    digitOrder: amount.slice(0, index).replace(/\D/g, "").length,
  }));
  const digitCount = amount.replace(/\D/g, "").length;

  return (
    <div
      className="hub-prize-flip"
      ref={rootRef}
      role="group"
      aria-label={`${amount.replace("đ", " đồng")}, tổng giải thưởng`}
    >
      <div className="hub-prize-flip__label" aria-hidden="true">
        <Gift size={18} />
        <span>Giải thưởng</span>
      </div>
      <div className="hub-prize-flip__digits" aria-hidden="true">
        {characters.map(({ character, digitOrder }, index) => {
          if (!/\d/.test(character)) {
            return <span className={character === "." ? "hub-prize-flip__separator" : "hub-prize-flip__suffix"} key={`${character}-${index}`}>{character}</span>;
          }

          const delay = digitOrder * 0.03;
          return (
            <span className="hub-prize-flip__digit" key={`${character}-${index}`}>
              <span className="hub-prize-flip__static">{character}</span>
              {isFlipping && !reduceMotion && (
                <>
                  <motion.span
                    className="hub-prize-flip__leaf hub-prize-flip__leaf--top"
                    key={`top-${flipCycle}-${index}`}
                    initial={{ rotateX: 0, opacity: 1 }}
                    animate={{ rotateX: -90, opacity: [1, 1, 0] }}
                    transition={{ duration: 0.28, delay, ease: "easeIn" }}
                  >
                    {character}
                  </motion.span>
                  <motion.span
                    className="hub-prize-flip__leaf hub-prize-flip__leaf--bottom"
                    key={`bottom-${flipCycle}-${index}`}
                    initial={{ rotateX: 90, opacity: 0 }}
                    animate={{ rotateX: 0, opacity: 1 }}
                    transition={{ duration: 0.28, delay: delay + 0.27, ease: "easeOut" }}
                    onAnimationComplete={digitOrder === digitCount - 1 ? () => setIsFlipping(false) : undefined}
                  >
                    {character}
                  </motion.span>
                </>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

const hubPrimaryMetric = {
  value: 10_000,
  label: "Giá trị giải thưởng đã trao",
  prefix: "$",
  suffix: "+",
  icon: Trophy,
};

const hubMetrics = [
  { value: 4, label: "Quest đã tổ chức", minDigits: 2, icon: ListChecks },
  { value: 10_000, label: "Người tham gia", icon: Users },
  { value: 10_000_000, label: "XP đã tạo", unit: "XP", icon: Zap },
];

type HubMetric = {
  value: number;
  label: string;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  unit?: string;
  minDigits?: number;
};

function HubMetricItem({ metric, primary = false }: { metric: HubMetric; primary?: boolean }) {
  const MetricIcon = metric.icon;

  return (
    <div className={`hub-metric${primary ? " hub-metrics__primary hub-metric--primary" : " hub-metric--support"}`}>
      <MetricIcon className="hub-metric__icon" aria-hidden="true" />
      <div className="hub-metric__copy">
        <strong
          className="hub-metrics__value"
          aria-label={`${metric.prefix ?? ""}${metric.value.toLocaleString("vi-VN", { minimumIntegerDigits: metric.minDigits })}${metric.suffix ?? ""}${metric.unit ? ` ${metric.unit}` : ""}`}
        >
          <span
            className="hub-metrics__number"
            aria-hidden="true"
            data-hub-count={metric.value}
            data-hub-prefix={metric.prefix ?? ""}
            data-hub-suffix={metric.suffix ?? ""}
            data-hub-min-digits={metric.minDigits ?? 1}
          >
            {`${metric.prefix ?? ""}${metric.value.toLocaleString("vi-VN", { minimumIntegerDigits: metric.minDigits })}${metric.suffix ?? ""}`}
          </span>
          {metric.unit && <small className="hub-metrics__unit" aria-hidden="true">{metric.unit}</small>}
        </strong>
        <span>{metric.label}</span>
      </div>
    </div>
  );
}

const partnerLogos = [
  partnerOpenAiLogo,
  partnerClaudeLogo,
  partnerGeminiLogo,
  partnerNvidiaLogo,
  partnerAwsLogo,
  partnerDeepseekLogo,
];

const hubLeaderboardMembers = createSampleLeaderboardMembers({
  "member-001": leaderHoangNamAvatar,
  "member-002": leaderboardMemberTwoAvatar,
  "member-003": leaderLinhNguyenAvatar,
});

function HubCarousel({ quest }: { quest: Quest }) {
  const reduceMotion = useReducedMotion();
  const [activeImage, setActiveImage] = useState(0);
  const [run, setRun] = useState(0);
  const autoplay = useRef(
    Autoplay({ delay: 10_000, stopOnInteraction: false, stopOnMouseEnter: false, stopOnFocusIn: false }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 26, watchDrag: true },
    reduceMotion ? [] : [autoplay.current],
  );

  const syncActiveImage = useCallback(() => {
    if (!emblaApi) return;
    setActiveImage(emblaApi.selectedScrollSnap());
    setRun((current) => current + 1);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    syncActiveImage();
    emblaApi.on("select", syncActiveImage);
    emblaApi.on("reInit", syncActiveImage);
    return () => {
      emblaApi.off("select", syncActiveImage);
      emblaApi.off("reInit", syncActiveImage);
    };
  }, [emblaApi, syncActiveImage]);

  const move = (direction: 1 | -1) => {
    if (!emblaApi) return;
    if (direction === 1) {
      emblaApi.scrollNext();
    } else {
      emblaApi.scrollPrev();
    }
    autoplay.current.reset();
  };

  return (
    <div
      className="hub-featured__carousel"
      role="region"
      aria-label="Ảnh campaign Build your first AI Agent"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="hub-featured__viewport" ref={emblaRef}>
        <div className="hub-featured__container">
          {quest.images.map((image, index) => (
            <div className="hub-featured__slide" key={image} aria-hidden={index !== activeImage}>
              <div className="hub-featured__photo" style={{ backgroundImage: `url(${image})` }} />
            </div>
          ))}
        </div>
      </div>
      <span className="hub-featured__index" aria-live="polite">
        {String(activeImage + 1).padStart(2, "0")} / {String(quest.images.length).padStart(2, "0")}
      </span>
      {!reduceMotion && (
        <i className="hub-featured__countdown" key={run} aria-hidden="true" />
      )}
      <button className="hub-featured__nav hub-featured__nav--prev" type="button" aria-label="Ảnh trước" onClick={() => move(-1)} />
      <button className="hub-featured__nav hub-featured__nav--next" type="button" aria-label="Ảnh tiếp theo" onClick={() => move(1)} />
    </div>
  );
}

function QuestList() {
  const featuredQuest = quests[0];
  const rootRef = useQuestHubMotion();
  const reduceMotion = useReducedMotion();
  const nowMs = useQuestHubClock();
  const [filter, setFilter] = useState("Tất cả");
  const [query, setQuery] = useState("");
  const [showMore, setShowMore] = useState(false);
  const [personalState, setPersonalState] = useState<QuestLocalState | null>(
    null,
  );
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<LeaderboardPeriod>("Toàn campaign");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.localStorage.getItem(storageKey(featuredQuest.slug))) return;
    setPersonalState(loadQuestState(featuredQuest.slug));
  }, [featuredQuest.slug]);

  const fixedXpTasks = campaignTasks.filter((task) => /^\+\d+ XP$/.test(task.reward));
  const earnedXp = personalState
    ? fixedXpTasks.reduce(
        (total, task) =>
          isComplete(personalState.tasks[task.id])
            ? total + Number(task.reward.replace(/[^\d]/g, ""))
            : total,
        0,
      )
    : 0;
  const nextTaskId = personalState
    ? campaignTasks.find((task) => !isComplete(personalState.tasks[task.id]))?.id
    : undefined;
  const catalog: HubCatalogItem[] = [
    ...hubRelatedQuests,
    {
      title: "AI Content Lab",
      description: "Từ insight thành một bài đăng có ích.",
      image: chillImage,
      status: "Đã kết thúc",
      prize: "5.000.000đ đã trao",
      xp: "800 XP đã tạo",
      incentive: "Xem kết quả",
    },
  ];
  const liveCatalog = catalog.map((quest) =>
    quest.startsAt || quest.endsAt
      ? { ...quest, status: getQuestPhase(quest, nowMs) }
      : quest,
  );
  const visibleCatalog = liveCatalog.filter((quest) => {
    const matchesFilter = filter === "Tất cả" || quest.status === filter;
    const searchable = `${quest.title} ${quest.description} ${quest.incentive}`.toLowerCase();
    return matchesFilter && searchable.includes(query.toLowerCase().trim());
  });
  const visibleItems = showMore || filter !== "Tất cả" || query ? visibleCatalog : visibleCatalog.filter((item) => item.status !== "Đã kết thúc");
  return (
    <PublicPageLayout>
      <main className="quest-page quest-page--hub" ref={rootRef}>
        <div className="quest-shell quest-hub">
          <section className="hub-metrics" aria-labelledby="quest-hub-title">
            <h1 className="sr-only" id="quest-hub-title">Quest</h1>
            <div className="hub-metrics__grid">
              <HubMetricItem metric={hubPrimaryMetric} primary />
              <div className="hub-metrics__support">
                {hubMetrics.map((metric) => (
                  <HubMetricItem key={metric.label} metric={metric} />
                ))}
              </div>
            </div>
          </section>

          <section className="quest-hub__sector hub-featured" aria-labelledby="featured-title">
            <HubCarousel quest={featuredQuest} />
            <div className="hub-featured__content">
              <div className="hub-featured__identity">
                <span>Quest nổi bật</span>
                <strong>{featuredQuest.partner}</strong>
              </div>
              <h2 id="featured-title">{featuredQuest.title}</h2>
              <p>{featuredQuest.description}</p>
              <div className="hub-featured__proof">
                <div className="hub-avatars" aria-hidden="true">
                  {[leaderHoangNamAvatar, leaderMinhChauAvatar, leaderLinhNguyenAvatar].map((avatar, index) => (
                    <img key={avatar} src={avatar} alt="" style={{ zIndex: 3 - index }} />
                  ))}
                </div>
                <strong>1.284 người đã tham gia</strong>
              </div>
              <QuestCountdown
                nowMs={nowMs}
                schedule={{ startsAt: featuredQuest.startsAt, endsAt: featuredQuest.endsAt }}
                variant="featured"
              />
              <PrizeFlipDisplay amount={featuredQuest.prize} reduceMotion={Boolean(reduceMotion)} />
              <div className="hub-featured__meta">
                <span><ListChecks size={17} /> 09 nhiệm vụ</span>
                <i aria-hidden="true" />
                <span><Zap size={17} /> 1.500 XP</span>
              </div>
              <Button asChild className="hub-featured__cta">
                <Link to={`/quests/${featuredQuest.slug}`}>Tham gia ngay <ArrowRight size={17} /></Link>
              </Button>
            </div>
          </section>

          <section className="quest-hub__sector hub-discover" id="quest-list" aria-labelledby="discover-title">
            <div className="hub-heading">
              <h2 id="discover-title">Khám phá Quest</h2>
            </div>
            <div className="hub-discover__toolbar">
              <label className="hub-search">
                <Search size={17} aria-hidden="true" />
                <span className="sr-only">Tìm Quest</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm Quest" />
              </label>
              <div className="hub-filters" aria-label="Lọc Quest">
                {["Tất cả", "Đang diễn ra", "Sắp mở", "Đã kết thúc"].map((item) => (
                  <button key={item} type="button" className={filter === item ? "is-active" : ""} onClick={() => setFilter(item)}>{item}</button>
                ))}
              </div>
            </div>
            <LayoutGroup>
              <motion.div layout className="hub-catalog">
                <AnimatePresence mode="popLayout" initial={false}>
                  {visibleItems.map((quest) => {
                    const body = <article className="hub-catalog__item">
                      <img src={quest.image} alt={`Ảnh campaign ${quest.title}`} />
                      <div className="hub-catalog__body">
                        <div className="hub-catalog__topline">
                          <span className={`hub-catalog__status hub-catalog__status--${quest.status === "Đang diễn ra" ? "active" : quest.status === "Sắp mở" ? "opening" : "closed"}`}>{quest.status}</span>
                          <QuestCountdown
                            nowMs={nowMs}
                            schedule={{ startsAt: quest.startsAt, endsAt: quest.endsAt }}
                            variant="compact"
                            phase={quest.status}
                          />
                        </div>
                        <h3>{quest.title}</h3>
                        <p>{quest.description}</p>
                        <div className="hub-catalog__proof">
                          {quest.participants ? <span><Users size={15} /> {quest.participants}</span> : <span><Gift size={15} /> {quest.prize}</span>}
                          {quest.participants ? <span><Gift size={15} /> {quest.prize}</span> : <span><Zap size={15} /> {quest.xp}</span>}
                        </div>
                        <div className="hub-catalog__footer">
                          <span className="hub-catalog__incentive">{quest.incentive}</span>
                          {quest.participants && <span className="hub-catalog__xp"><Zap size={15} /> {quest.xp}</span>}
                        </div>
                      </div>
                    </article>;
                    return (
                      <motion.div
                        layout
                        key={quest.title}
                        className="hub-catalog__motion"
                        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: reduceMotion ? 0 : 0.24, ease: "easeOut" }}
                      >
                        {body}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </LayoutGroup>
            {!showMore && filter === "Tất cả" && !query && (
              <button className="hub-more" type="button" onClick={() => setShowMore(true)}>Xem thêm Quest <ArrowRight size={16} /></button>
            )}
          </section>

          <section className="quest-hub__sector hub-personal" aria-labelledby="personal-title">
            <div className="hub-heading"><h2 id="personal-title">Dành cho bạn</h2></div>
            {personalState ? (
              <div className="hub-personal__active">
                <div><span>{featuredQuest.title}</span><strong>{earnedXp.toLocaleString("vi-VN")} / 1.500 XP</strong></div>
                <div className="hub-personal__rail" aria-label={`${earnedXp} trên 1.500 XP`}>
                  {campaignTasks.map((task) => (
                    <motion.i
                      layout
                      key={task.id}
                      className={isComplete(personalState.tasks[task.id]) ? "is-done" : task.id === nextTaskId ? "is-next" : ""}
                      transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 24 }}
                    >
                      {isComplete(personalState.tasks[task.id]) ? <Check size={15} /> : String(task.id).padStart(2, "0")}
                    </motion.i>
                  ))}
                  <i className="is-empty" aria-label="Nhiệm vụ sắp có" />
                </div>
                <Button variant="outline" asChild><Link to={`/quests/${featuredQuest.slug}`}>Tiếp tục Quest <ArrowRight size={16} /></Link></Button>
              </div>
            ) : (
              <div className="hub-personal__empty"><p>Chưa tham gia Quest nào.</p><a href="#quest-list">Khám phá Quest <ArrowRight size={16} /></a></div>
            )}
          </section>

          <QuestLeaderboardHeatmap
            members={hubLeaderboardMembers}
            period={leaderboardPeriod}
            onPeriodChange={setLeaderboardPeriod}
            reduceMotion={Boolean(reduceMotion)}
          />

          <section className="quest-hub__sector hub-partner" aria-labelledby="partner-title">
            <img className="hub-partner__photo" src={communityForumImage} alt="Cộng đồng Nghiên AI tại sự kiện" />
            <div className="hub-partner__content">
              <span>Nghiên AI</span>
              <h2 id="partner-title">Top #1 cộng đồng AI tại Việt Nam</h2>
              <p>10 triệu lượt xem mỗi tháng</p>
              <div className="hub-partner__logos" aria-label="Đối tác đã hợp tác">
                <div>{[...partnerLogos, ...partnerLogos].map((logo, index) => <img src={logo} alt="Logo đối tác" key={`${logo}-${index}`} />)}</div>
              </div>
              <div className="hub-partner__actions"><Button asChild><Link to="/thiet-ke-quest">Launch your campaign <ArrowRight size={16} /></Link></Button><Button asChild variant="outline"><Link to="/thiet-ke-quest">Work with us</Link></Button></div>
              <a className="hub-community-link" href="https://www.facebook.com/groups/aiartworksvn" target="_blank" rel="noreferrer">Tham gia cộng đồng Facebook <ExternalLink size={15} /></a>
            </div>
          </section>
        </div>
      </main>
    </PublicPageLayout>
  );
}

function initialQuestState(): QuestLocalState {
  return {
    tasks: {
      1: { status: "done", choice: campaignTasks[0].options?.[0] },
      2: { status: "done", opened: true },
    },
  };
}

function storageKey(slug: string) {
  return `nghien-ai.quest.${slug}.v1`;
}

function loadQuestState(slug: string): QuestLocalState {
  const fallback = initialQuestState();
  if (typeof window === "undefined") return fallback;
  try {
    const saved = window.localStorage.getItem(storageKey(slug));
    if (!saved) return fallback;
    const parsed = JSON.parse(saved) as Partial<QuestLocalState>;
    return {
      tasks: { ...fallback.tasks, ...(parsed.tasks ?? {}) },
    };
  } catch {
    return fallback;
  }
}

function isComplete(submission?: TaskSubmission) {
  return submission?.status === "done" || submission?.status === "submitted";
}

function getValidUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

function hasAllowedSocialHost(value: string, channel: "x" | "facebook") {
  const url = getValidUrl(value);
  if (!url) return false;
  const hosts =
    channel === "x"
      ? ["x.com", "www.x.com", "twitter.com", "www.twitter.com"]
      : ["facebook.com", "www.facebook.com", "m.facebook.com"];
  return hosts.includes(url.hostname.toLowerCase());
}

function openInNewTab(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

function SubmissionNotice({
  submission,
  kind,
}: {
  submission?: TaskSubmission;
  kind: TaskKind;
}) {
  if (!submission?.status) return null;
  if (submission.status === "submitted")
    return (
      <p className="task-submission-note">
        <Check size={15} />
        <span>
          <strong>Đã gửi — chờ duyệt</strong>
          <small>Bản thử: Nghiên AI chưa nhận bài nộp này.</small>
        </span>
      </p>
    );
  const message =
    kind === "badge"
      ? "Đã nhận huy hiệu"
      : kind === "quiz"
        ? "Đã trả lời đúng"
        : kind === "upload"
          ? "Đã thêm ảnh proof"
          : "Đã xong";
  return (
    <p
      className={`task-submission-note task-submission-note--done ${kind === "badge" ? "task-submission-note--badge" : ""}`}
    >
      <Check size={15} />
      <strong>{message}</strong>
    </p>
  );
}

function TaskRenderer({
  task,
  submission,
  locked,
  onChange,
}: {
  task: TaskDefinition;
  submission?: TaskSubmission;
  locked: boolean;
  onChange: (next: TaskSubmission) => void;
}) {
  const [draft, setDraft] = useState(
    submission?.url ??
      submission?.text ??
      submission?.accountId ??
      submission?.checkInCode ??
      "",
  );
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPreview, setDrawPreview] = useState("");
  const drawTimer = useRef<number | null>(null);
  const drawTicker = useRef<number | null>(null);
  const completed = isComplete(submission);
  useEffect(
    () => () => {
      if (drawTimer.current) window.clearTimeout(drawTimer.current);
      if (drawTicker.current) window.clearInterval(drawTicker.current);
    },
    [],
  );
  const saveUrl = (message: string) => {
    const url = getValidUrl(draft);
    if (!url) return setError(message);
    onChange({ ...submission, url: url.toString(), status: "submitted" });
    setError("");
  };

  if (task.kind === "badge") {
    if (locked)
      return (
        <p className="task-lock-note">
          Hoàn thành hoặc nộp đủ 7 nhiệm vụ chính phía trên để mở huy hiệu.
        </p>
      );
    if (completed)
      return <SubmissionNotice submission={submission} kind={task.kind} />;
    return (
      <button
        type="button"
        className="task-action task-action--primary"
        onClick={() => onChange({ status: "done" })}
      >
        <Check size={16} /> Nhận huy hiệu
      </button>
    );
  }
  if (task.kind === "quiz") {
    if (completed)
      return (
        <div className="task-interaction">
          <div className="task-options">
            {task.options?.map((option, index) => (
              <button
                key={option}
                type="button"
                className={`task-option ${index === task.correctOption ? "is-correct" : ""}`}
                disabled
              >
                {option}
                {index === task.correctOption && <Check size={15} />}
              </button>
            ))}
          </div>
          <div className="task-quiz__result">
            <SubmissionNotice submission={submission} kind={task.kind} />
            <button
              type="button"
              className="task-action"
              onClick={() => onChange({})}
            >
              Làm lại câu hỏi
            </button>
          </div>
        </div>
      );
    return (
      <div className="task-interaction">
        <div className="task-options">
          {task.options?.map((option, index) => (
            <button
              key={option}
              type="button"
              className="task-option"
              onClick={() => {
                if (index === task.correctOption) {
                  onChange({ choice: option, status: "done" });
                  setError("");
                } else
                  setError(
                    "Chưa đúng. Hãy chọn việc nhỏ, lặp lại và có kết quả rõ ràng.",
                  );
              }}
            >
              {option}
            </button>
          ))}
        </div>
        {error && <p className="task-error">{error}</p>}
      </div>
    );
  }

  if (task.kind === "vote" && completed)
    return (
      <div className="task-interaction">
        <div className="task-options">
          {task.options?.map((option) => (
            <button
              key={option}
              type="button"
              className={`task-option ${submission?.vote === option ? "is-correct" : ""}`}
              disabled
            >
              {option}
              {submission?.vote === option && <Check size={15} />}
            </button>
          ))}
        </div>
        <SubmissionNotice submission={submission} kind={task.kind} />
      </div>
    );

  if (completed)
    return <SubmissionNotice submission={submission} kind={task.kind} />;

  if (task.kind === "external-link") {
    const opened = submission?.opened;
    return (
      <div className="task-interaction task-external">
        <button
          type="button"
          className="task-action"
          onClick={() => {
            if (task.url) openInNewTab(task.url);
            onChange({ ...submission, opened: true });
          }}
        >
          <ExternalLink size={15} /> Mở Docs
        </button>
        {opened && (
          <button
            type="button"
            className="task-action task-action--primary"
            onClick={() =>
              onChange({ ...submission, opened: true, status: "done" })
            }
          >
            <Check size={15} /> Tôi đã xem hướng dẫn
          </button>
        )}
      </div>
    );
  }

  if (task.kind === "social-share") {
    const selected = submission?.shareChannel;
    const target = task.shareTargets;
    const shareOnX = () => {
      if (!target) return;
      onChange({ ...submission, shareChannel: "x" });
      openInNewTab(
        `https://x.com/intent/post?url=${encodeURIComponent(target.x)}&text=${encodeURIComponent("Mình đang tham gia Build your first AI Agent cùng Nghiên AI × OpenClaw.")}`,
      );
    };
    const shareOnFacebook = () => {
      if (!target) return;
      onChange({ ...submission, shareChannel: "facebook" });
      openInNewTab(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(target.facebook)}`,
      );
    };
    return (
      <div className="task-interaction">
        <div className="task-social-actions">
          <button
            type="button"
            className={`task-action ${selected === "x" ? "is-selected" : ""}`}
            onClick={shareOnX}
          >
            Chia sẻ trên X
          </button>
          <button
            type="button"
            className={`task-action ${selected === "facebook" ? "is-selected" : ""}`}
            onClick={shareOnFacebook}
          >
            Chia sẻ trên Facebook
          </button>
        </div>
        {selected && (
          <div className="task-link-form">
            <label htmlFor={`task-${task.id}-url`}>{task.label}</label>
            <div>
              <input
                id={`task-${task.id}-url`}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={task.placeholder}
                inputMode="url"
              />
              <button
                type="button"
                className="task-action task-action--primary"
                onClick={() => {
                  if (!hasAllowedSocialHost(draft, selected))
                    return setError(
                      selected === "x"
                        ? "Hãy dán link post từ x.com hoặc twitter.com."
                        : "Hãy dán link post từ facebook.com.",
                    );
                  onChange({
                    ...submission,
                    shareChannel: selected,
                    url: draft.trim(),
                    status: "submitted",
                  });
                  setError("");
                }}
              >
                Nộp link
              </button>
            </div>
            {error && <p className="task-error">{error}</p>}
          </div>
        )}
      </div>
    );
  }

  if (task.kind === "link-submission" || task.kind === "community-feedback")
    return (
      <div className="task-interaction task-link-form">
        <label htmlFor={`task-${task.id}-url`}>{task.label}</label>
        <div>
          <input
            id={`task-${task.id}-url`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={task.placeholder}
            inputMode="url"
          />
          <button
            type="button"
            className="task-action task-action--primary"
            onClick={() =>
              saveUrl(
                "Hãy dán một URL hợp lệ bắt đầu bằng http:// hoặc https://.",
              )
            }
          >
            Nộp link
          </button>
        </div>
        {error && <p className="task-error">{error}</p>}
      </div>
    );

  if (task.kind === "account-id")
    return (
      <div className="task-interaction task-link-form">
        <label htmlFor={`task-${task.id}-account`}>
          {task.label ?? "ID tài khoản"}
        </label>
        <div>
          <input
            id={`task-${task.id}-account`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={task.placeholder ?? "Nhập ID của bạn"}
          />
          <button
            type="button"
            className="task-action task-action--primary"
            onClick={() => {
              if (draft.trim().length < (task.minLength ?? 3))
                return setError("ID chưa đúng định dạng. Hãy kiểm tra lại.");
              onChange({ accountId: draft.trim(), status: "submitted" });
              setError("");
            }}
          >
            Nộp ID
          </button>
        </div>
        {error && <p className="task-error">{error}</p>}
      </div>
    );

  if (task.kind === "writing")
    return (
      <div className="task-interaction task-writing">
        <label htmlFor={`task-${task.id}-text`}>
          {task.label ?? "Câu trả lời của bạn"}
        </label>
        <textarea
          id={`task-${task.id}-text`}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder={task.placeholder}
        />
        <button
          type="button"
          className="task-action task-action--primary"
          onClick={() => {
            if (draft.trim().length < (task.minLength ?? 80))
              return setError(`Viết ít nhất ${task.minLength ?? 80} ký tự.`);
            onChange({ text: draft.trim(), status: "submitted" });
            setError("");
          }}
        >
          Gửi nội dung
        </button>
        {error && <p className="task-error">{error}</p>}
      </div>
    );

  if (task.kind === "upload")
    return (
      <div
        className={`task-interaction task-upload ${isDragging ? "is-dragging" : ""}`}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={() => setIsDragging(false)}
      >
        <label htmlFor={`task-${task.id}-file`}>
          {task.label ?? "Chọn file hoặc ảnh bằng chứng"}
        </label>
        <input
          id={`task-${task.id}-file`}
          type="file"
          accept={task.accept}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            if (
              task.accept?.startsWith("image/") &&
              !file.type.startsWith("image/")
            )
              return setError("Hãy chọn ảnh PNG, JPG hoặc WEBP.");
            if (
              task.maxFileSizeMb &&
              file.size > task.maxFileSizeMb * 1024 * 1024
            )
              return setError(`Ảnh phải nhỏ hơn ${task.maxFileSizeMb} MB.`);
            onChange({ fileName: file.name, status: "done" });
            setIsDragging(false);
            setError("");
          }}
        />
        <small>
          Chỉ giữ tên file trong bản thử này, không tải file lên máy chủ.
        </small>
        {error && <p className="task-error">{error}</p>}
      </div>
    );

  if (task.kind === "vote")
    return (
      <div className="task-interaction">
        <div className="task-options">
          {task.options?.map((option) => (
            <button
              key={option}
              type="button"
              className="task-option"
              onClick={() => onChange({ vote: option, status: "done" })}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    );

  if (task.kind === "lucky-draw") {
    if (locked)
      return (
        <p className="task-lock-note">
          Hoàn thành đủ 7 nhiệm vụ chính để mở lượt rút thăm.
        </p>
      );
    if (completed)
      return (
        <div className="task-lucky-result">
          <strong>Kết quả mô phỏng: {submission?.drawResult}</strong>
          <small>
            Lucky Draw chỉ chạy local trong bản thử, không quy đổi thành quà
            tặng thật.
          </small>
        </div>
      );
    return (
      <div className="task-interaction">
        <button
          type="button"
          className="task-action task-action--primary"
          disabled={isDrawing}
          onClick={() => {
            const results = task.drawResults ?? [
              "Chưa có phần thưởng được cấu hình",
            ];
            if (isDrawing) return;
            setIsDrawing(true);
            const result = results[Math.floor(Math.random() * results.length)];
            let spin = 0;
            drawTicker.current = window.setInterval(() => {
              setDrawPreview(results[spin % results.length]);
              spin += 1;
            }, 90);
            drawTimer.current = window.setTimeout(() => {
              if (drawTicker.current) window.clearInterval(drawTicker.current);
              setDrawPreview("");
              setIsDrawing(false);
              onChange({ drawResult: result, status: "done" });
            }, 720);
          }}
        >
          {isDrawing ? "Đang rút…" : "Rút một lượt"}
        </button>
        <small>
          {isDrawing
            ? `Đang chọn: ${drawPreview || "…"}`
            : "Chỉ có một lượt trong trạng thái local của quest này."}
        </small>
      </div>
    );
  }

  if (task.kind === "check-in")
    return (
      <div className="task-interaction task-link-form">
        <label htmlFor={`task-${task.id}-code`}>
          {task.label ?? "Mã tham gia"}
        </label>
        <div>
          <input
            id={`task-${task.id}-code`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={task.placeholder ?? "Nhập mã"}
          />
          <button
            type="button"
            className="task-action task-action--primary"
            onClick={() => {
              if (draft.trim().length < (task.minLength ?? 4))
                return setError("Mã chưa đúng định dạng.");
              onChange({ checkInCode: draft.trim(), status: "submitted" });
              setError("");
            }}
          >
            Xác nhận
          </button>
        </div>
        {error && <p className="task-error">{error}</p>}
      </div>
    );

  return null;
}

const burstPieces = [
  { x: -72, y: -40, rotate: -120, color: "orange" },
  { x: -46, y: -72, rotate: 80, color: "ink" },
  { x: -12, y: -86, rotate: -40, color: "cream" },
  { x: 28, y: -76, rotate: 120, color: "orange" },
  { x: 64, y: -42, rotate: -90, color: "ink" },
  { x: 78, y: 2, rotate: 70, color: "cream" },
  { x: 52, y: 40, rotate: -130, color: "orange" },
  { x: 10, y: 62, rotate: 90, color: "ink" },
  { x: -38, y: 50, rotate: -60, color: "cream" },
  { x: -72, y: 14, rotate: 140, color: "orange" },
];

function JoinBurst({ origin }: { origin: { x: number; y: number } | null }) {
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence>
      {origin && !reduceMotion && (
        <motion.div
          className="quest-join-burst"
          style={{ left: origin.x, top: origin.y }}
          aria-hidden="true"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {burstPieces.map((piece, index) => (
            <motion.i
              key={index}
              className={`quest-join-burst__piece is-${piece.color}`}
              initial={{ x: 0, y: 0, rotate: 0, scale: 0.7, opacity: 1 }}
              animate={{
                x: piece.x,
                y: piece.y,
                rotate: piece.rotate,
                scale: 1,
                opacity: 0,
              }}
              transition={{
                duration: 0.78,
                delay: index * 0.012,
                ease: [0.18, 0.8, 0.25, 1],
              }}
            />
          ))}
          {Array.from({ length: 8 }).map((_, index) => (
            <motion.i
              key={`ray-${index}`}
              className="quest-join-burst__ray"
              style={{ "--ray-angle": `${index * 45}deg` } as CSSProperties}
              initial={{ scaleX: 0, opacity: 1 }}
              animate={{ scaleX: 1, opacity: 0 }}
              transition={{
                duration: 0.48,
                delay: index * 0.015,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AnimatedNumber({
  value,
  format,
}: {
  value: number;
  format?: (value: number) => string;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  useEffect(() => {
    const startedAt = performance.now();
    let frameId = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));
      if (progress < 1) frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [value]);
  return (
    <>{format ? format(displayValue) : displayValue.toLocaleString("vi-VN")}</>
  );
}

function CampaignDossier({
  openIds,
  onToggle,
  onToggleAll,
}: {
  openIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
}) {
  const allOpen = openIds.size === campaignDossier.length;
  const renderColumn = (column: DossierColumn) => (
    <div className="campaign-dossier__column">
      {campaignDossier
        .filter((item) => item.column === column)
        .map((item) => {
          const open = openIds.has(item.id);
          const Icon = item.icon;
          const contentId = `campaign-dossier-${item.id}`;
          return (
            <article
              key={item.id}
              className={`campaign-dossier__item ${open ? "is-open" : ""}`}
            >
              <button
                type="button"
                className="campaign-dossier__trigger"
                onClick={() => onToggle(item.id)}
                aria-expanded={open}
                aria-controls={contentId}
              >
                <span>
                  <Icon size={17} /> {item.title}
                </span>
                <ChevronDown size={17} />
              </button>
              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    id={contentId}
                    className="campaign-dossier__content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {item.intro && <p>{item.intro}</p>}
                    {item.items && (
                      <ul>
                        {item.items.map((entry, index) => (
                          <motion.li
                            key={entry}
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.04 }}
                          >
                            {entry}
                          </motion.li>
                        ))}
                      </ul>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
    </div>
  );

  return (
    <section className="campaign-dossier">
      <div className="campaign-dossier__head">
        <div className="campaign-dossier__title">
          <h2>Thông tin chiến dịch</h2>
          <p>
            Đọc trước khi bắt đầu: mục tiêu, thời hạn, bài nộp, giải thưởng và
            nơi cần hỗ trợ.
          </p>
        </div>
        <div className="campaign-dossier__actions">
          <button
            type="button"
            className="campaign-dossier__action"
            onClick={onToggleAll}
            aria-expanded={allOpen}
          >
            {allOpen ? "Đóng tất cả" : "Mở tất cả"}
            <ChevronDown size={15} className={allOpen ? "is-open" : ""} />
          </button>
          <button
            type="button"
            className="campaign-dossier__action campaign-dossier__action--disabled"
            disabled
            aria-disabled="true"
          >
            <FileText size={15} /> Bài hướng dẫn <span>Sắp có</span>
          </button>
        </div>
      </div>
      <div className="campaign-dossier__grid">
        {renderColumn("primary")}
        {renderColumn("secondary")}
      </div>
    </section>
  );
}

function CampaignQuestDetail({ quest }: { quest: Quest }) {
  const rootRef = useQuestMotion();
  const reduceMotion = useReducedMotion();
  const [activeImage, setActiveImage] = useState(0);
  const [carouselRun, setCarouselRun] = useState(0);
  const [carouselDirection, setCarouselDirection] = useState<1 | -1>(1);
  const [isManualSlide, setIsManualSlide] = useState(false);
  const [isGalleryDragging, setIsGalleryDragging] = useState(false);
  const [questState, setQuestState] = useState(() =>
    loadQuestState(quest.slug),
  );
  const [openStep, setOpenStep] = useState<number | null>(3);
  const [openDossierIds, setOpenDossierIds] = useState<Set<string>>(
    () => new Set(["intro"]),
  );
  const [pulseIndex, setPulseIndex] = useState(0);
  const [hasJoined, setHasJoined] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [shareFeedback, setShareFeedback] = useState<
    "copied" | "opened" | null
  >(null);
  const [burstOrigin, setBurstOrigin] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const burstTimer = useRef<number | null>(null);
  const galleryPointer = useRef<{ id: number; startX: number } | null>(null);
  const shareMenuRef = useRef<HTMLDivElement | null>(null);
  const coreTasks = campaignTasks.filter(
    (task) => task.kind !== "badge" && !task.isBonus,
  );
  const completedCount = coreTasks.filter((task) =>
    isComplete(questState.tasks[task.id]),
  ).length;
  const fixedXpTasks = campaignTasks.filter((task) =>
    /^\+\d+ XP$/.test(task.reward),
  );
  const earnedXp = fixedXpTasks.reduce(
    (total, task) =>
      isComplete(questState.tasks[task.id])
        ? total + Number(task.reward.replace(/[^\d]/g, ""))
        : total,
    0,
  );
  const totalFixedQuestXp = fixedXpTasks.reduce(
    (total, task) => total + Number(task.reward.replace(/[^\d]/g, "")),
    0,
  );
  const nextTaskId = campaignTasks.find(
    (task) => !isComplete(questState.tasks[task.id]),
  )?.id;
  const allCoreTasksComplete = completedCount === coreTasks.length;
  const currentPulse = pulseMessages[pulseIndex];

  useEffect(
    () => () => {
      if (burstTimer.current) window.clearTimeout(burstTimer.current);
    },
    [],
  );
  useEffect(() => {
    setQuestState(loadQuestState(quest.slug));
    setActiveImage(0);
    setCarouselRun(0);
    setIsManualSlide(false);
    setOpenStep(3);
    setOpenDossierIds(new Set(["intro"]));
    setHasJoined(false);
    setShareMenuOpen(false);
  }, [quest.slug]);
  useEffect(() => {
    if (reduceMotion || isGalleryDragging || quest.images.length < 2) return;
    const carouselTimeout = window.setTimeout(() => {
      setCarouselDirection(1);
      setIsManualSlide(false);
      setActiveImage((current) => (current + 1) % quest.images.length);
      setCarouselRun((current) => current + 1);
    }, 10000);
    return () => window.clearTimeout(carouselTimeout);
  }, [
    activeImage,
    carouselRun,
    isGalleryDragging,
    quest.images.length,
    reduceMotion,
  ]);
  useEffect(() => {
    const pulseInterval = window.setInterval(
      () =>
        setPulseIndex((current) => {
          let next = current;
          while (next === current)
            next = Math.floor(Math.random() * pulseMessages.length);
          return next;
        }),
      10000,
    );
    return () => window.clearInterval(pulseInterval);
  }, []);
  useEffect(() => {
    window.localStorage.setItem(
      storageKey(quest.slug),
      JSON.stringify(questState),
    );
  }, [questState, quest.slug]);
  useEffect(() => {
    if (!shareMenuOpen) return;
    const closeOnPointerDown = (event: globalThis.MouseEvent) => {
      if (!shareMenuRef.current?.contains(event.target as Node))
        setShareMenuOpen(false);
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setShareMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOnPointerDown);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnPointerDown);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [shareMenuOpen]);

  const updateTask = (taskId: number, submission: TaskSubmission) =>
    setQuestState((current) => ({
      ...current,
      tasks: { ...current.tasks, [taskId]: submission },
    }));
  const toggleDossierItem = (id: string) =>
    setOpenDossierIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleAllDossierItems = () =>
    setOpenDossierIds((current) =>
      current.size === campaignDossier.length
        ? new Set()
        : new Set(campaignDossier.map((item) => item.id)),
    );
  const moveCarousel = (direction: 1 | -1) => {
    if (quest.images.length < 2) return;
    setCarouselDirection(direction);
    setIsManualSlide(true);
    setActiveImage(
      (current) =>
        (current + direction + quest.images.length) % quest.images.length,
    );
    setCarouselRun((current) => current + 1);
  };
  const handleGalleryPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    galleryPointer.current = { id: event.pointerId, startX: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsGalleryDragging(true);
  };
  const handleGalleryPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const pointer = galleryPointer.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    const delta = event.clientX - pointer.startX;
    galleryPointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    setIsGalleryDragging(false);
    if (window.getSelection()?.toString()) return;
    if (Math.abs(delta) >= 48) {
      moveCarousel(delta < 0 ? 1 : -1);
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    moveCarousel(event.clientX - bounds.left < bounds.width / 2 ? -1 : 1);
  };
  const handleGalleryPointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    if (galleryPointer.current?.id !== event.pointerId) return;
    galleryPointer.current = null;
    setIsGalleryDragging(false);
  };
  const handleGalleryKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    moveCarousel(event.key === "ArrowRight" ? 1 : -1);
  };
  const joinQuest = (event: MouseEvent<HTMLButtonElement>) => {
    if (!hasJoined && !reduceMotion) {
      const rect = event.currentTarget.getBoundingClientRect();
      setBurstOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
      burstTimer.current = window.setTimeout(() => setBurstOrigin(null), 850);
    }
    setHasJoined(true);
  };
  const setShareNotice = (notice: "copied" | "opened") => {
    setShareFeedback(notice);
    window.setTimeout(() => setShareFeedback(null), 1600);
  };
  const shareQuest = (channel: "x" | "facebook") => {
    const url = window.location.href;
    setShareMenuOpen(false);
    setShareNotice("opened");
    if (channel === "facebook") {
      openInNewTab(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      );
      return;
    }
    openInNewTab(
      `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=${encodeURIComponent(quest.description)}`,
    );
  };
  const copyQuestLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const field = document.createElement("textarea");
      field.value = url;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setShareMenuOpen(false);
    setShareNotice("copied");
  };

  return (
    <PublicPageLayout>
      <motion.div
        ref={rootRef}
        className="quest-page quest-page--detail"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.22 }}
      >
        <JoinBurst origin={burstOrigin} />
        <div className="quest-detail-shell">
          <div className="quest-breadcrumb">
            <Link to="/quests">
              <ArrowLeft size={15} /> Tất cả quest
            </Link>
            <ChevronRight size={14} />
            <span>{quest.title}</span>
          </div>
          <section className="detail-hero detail-hero--campaign">
            <div className="detail-intro detail-intro--brief">
              <div className="detail-intro__utility">
                <div className="detail-kicker">
                  <Badge className="quest-badge">{quest.badge}</Badge>
                  <span>{quest.partner}</span>
                </div>
                <p
                  className="detail-live detail-live--brief"
                  aria-live="polite"
                >
                  <span className="live-dot" />{" "}
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={pulseIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: reduceMotion ? 0 : 0.26 }}
                    >
                      {currentPulse[0]} {currentPulse[1]} · {currentPulse[2]}
                    </motion.span>
                  </AnimatePresence>
                </p>
              </div>
              <h1>{quest.title}</h1>
              <p>{quest.description}</p>
              <div className="detail-brief__footer">
                <div className="detail-meta detail-meta--brief">
                  <div>
                    <Users size={24} />
                    <strong>
                      <AnimatedNumber value={1284} />
                    </strong>
                    <span>người chơi</span>
                  </div>
                  <div>
                    <Clock3 size={24} />
                    <strong>
                      <AnimatedNumber value={2} /> ngày{" "}
                      <AnimatedNumber value={14} /> giờ
                    </strong>
                    <span>còn lại</span>
                  </div>
                  <div>
                    <Gift size={24} />
                    <strong>
                      <AnimatedNumber
                        value={15000000}
                        format={(value) => `${value.toLocaleString("vi-VN")}đ`}
                      />
                    </strong>
                    <span>Tổng giải thưởng</span>
                  </div>
                </div>
                <div className="detail-action-row">
                  <motion.div
                    whileHover={reduceMotion ? undefined : { scale: 1.015 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                  >
                    <Button
                      size="lg"
                      className="detail-join"
                      onClick={joinQuest}
                    >
                      {hasJoined ? (
                        <>
                          <Check size={20} /> Đã tham gia
                        </>
                      ) : (
                        <>
                          <Zap size={20} /> Tham gia
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <div className="detail-share-menu" ref={shareMenuRef}>
                    <button
                      type="button"
                      className="detail-share"
                      onClick={() => setShareMenuOpen((current) => !current)}
                      aria-expanded={shareMenuOpen}
                      aria-haspopup="menu"
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={shareFeedback ?? "share"}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {shareFeedback === "copied" ? (
                            <>
                              <Check size={18} /> Đã sao chép
                            </>
                          ) : shareFeedback === "opened" ? (
                            <>
                              <Check size={18} /> Đã mở
                            </>
                          ) : (
                            <>
                              <Share2 size={18} /> Chia sẻ
                            </>
                          )}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                    <AnimatePresence>
                      {shareMenuOpen && (
                        <motion.div
                          className="detail-share-menu__popover"
                          role="menu"
                          initial={{ opacity: 0, y: reduceMotion ? 0 : -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: reduceMotion ? 0 : -5 }}
                          transition={{ duration: reduceMotion ? 0 : 0.18 }}
                        >
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => shareQuest("x")}
                          >
                            Chia sẻ trên X <ExternalLink size={15} />
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => shareQuest("facebook")}
                          >
                            Chia sẻ trên Facebook <ExternalLink size={15} />
                          </button>
                          <button
                            type="button"
                            role="menuitem"
                            onClick={copyQuestLink}
                          >
                            Sao chép link <Copy size={15} />
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className="sr-only" aria-live="polite">
                    {hasJoined ? "Bạn đã tham gia quest trong phiên này." : ""}
                  </span>
                </div>
              </div>
            </div>
            <div className="detail-gallery detail-gallery--campaign">
              <div
                className={`detail-main-image detail-main-image--interactive ${isGalleryDragging ? "is-dragging" : ""}`}
                role="region"
                aria-roledescription="carousel"
                aria-label={`Ảnh giới thiệu ${quest.title}`}
                tabIndex={0}
                onPointerDown={handleGalleryPointerDown}
                onPointerUp={handleGalleryPointerEnd}
                onPointerCancel={handleGalleryPointerCancel}
                onKeyDown={handleGalleryKeyDown}
              >
                <AnimatePresence initial={false} mode="sync">
                  <motion.div
                    key={`${quest.slug}-${activeImage}-${carouselRun}`}
                    className="detail-main-image__photo"
                    style={{
                      backgroundImage: `url(${quest.images[activeImage]})`,
                    }}
                    initial={
                      reduceMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            x: isManualSlide ? carouselDirection * 18 : 0,
                            scale: isManualSlide ? 1 : 1.025,
                          }
                    }
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={
                      reduceMotion
                        ? { opacity: 0 }
                        : {
                            opacity: 0,
                            x: isManualSlide ? carouselDirection * -18 : 0,
                          }
                    }
                    transition={{
                      duration: reduceMotion ? 0 : isManualSlide ? 0.36 : 0.7,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  />
                </AnimatePresence>
                <span className="detail-carousel-index" aria-live="polite">
                  {String(activeImage + 1).padStart(2, "0")} /{" "}
                  {String(quest.images.length).padStart(2, "0")}
                </span>
                <span className="detail-carousel-progress" aria-hidden="true">
                  <span
                    key={`${quest.slug}-${carouselRun}`}
                    className="detail-carousel-progress__fill"
                  />
                </span>
              </div>
            </div>
          </section>
          <section className="sponsor-strip" aria-label="OpenClaw">
            <div className="sponsor-brand">
              <img className="sponsor-logo" src={openClawBrandMark} alt="" />
              <div className="sponsor-copy">
                <h2>OpenClaw</h2>
                <p>AI assistant mã nguồn mở chạy trên máy của bạn.</p>
              </div>
            </div>
            <nav className="sponsor-links" aria-label="Liên kết OpenClaw">
              <a
                href="https://openclaw.ai/"
                target="_blank"
                rel="noreferrer"
                aria-label="Mở website OpenClaw"
                title="Website"
              >
                <Globe2 size={18} aria-hidden="true" />
              </a>
              <a
                href="https://github.com/openclaw/openclaw"
                target="_blank"
                rel="noreferrer"
                aria-label="Mở GitHub OpenClaw"
                title="GitHub"
              >
                <Github size={18} aria-hidden="true" />
              </a>
              <a
                href="https://docs.openclaw.ai/"
                target="_blank"
                rel="noreferrer"
                aria-label="Mở tài liệu OpenClaw"
                title="Docs"
              >
                <FileText size={18} aria-hidden="true" />
              </a>
            </nav>
          </section>
          <CampaignDossier
            openIds={openDossierIds}
            onToggle={toggleDossierItem}
            onToggleAll={toggleAllDossierItems}
          />
          <div className="detail-content-grid">
            <main className="detail-content-main">
              <section className="quest-panel quest-panel--tasks">
                <div className="panel-heading">
                  <h2>Nhiệm vụ & hướng dẫn</h2>
                  <span className="panel-index">
                    {completedCount.toString().padStart(2, "0")} /{" "}
                    {coreTasks.length.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="quest-steps">
                  {campaignTasks.map((task) => {
                    const submission = questState.tasks[task.id];
                    const completed = isComplete(submission);
                    const locked =
                      (task.kind === "badge" || task.kind === "lucky-draw") &&
                      !allCoreTasksComplete;
                    const isXpTask = /^\+\d+ XP$/.test(task.reward);
                    const status =
                      isXpTask && completed ? (
                        <motion.span
                          className="step-reward-badge"
                          initial={{
                            opacity: 0,
                            scale: reduceMotion ? 1 : 0.82,
                          }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.24,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          <Check size={14} /> {task.reward}
                        </motion.span>
                      ) : task.kind === "lucky-draw" ? (
                        completed ? (
                          "Đã rút"
                        ) : (
                          task.reward
                        )
                      ) : (
                        task.reward
                      );
                    const statusClass = isXpTask
                      ? completed
                        ? "step-status--earned"
                        : "step-status--pending"
                      : "step-status--action";
                    return (
                      <motion.div
                        layout
                        key={task.id}
                        className={`quest-step ${completed ? "is-done" : ""} ${openStep === task.id ? "is-open" : ""} ${locked ? "is-locked" : ""} ${task.isBonus ? "is-bonus" : ""}`}
                        transition={{ duration: reduceMotion ? 0 : 0.24 }}
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenStep(openStep === task.id ? null : task.id)
                          }
                          aria-expanded={openStep === task.id}
                        >
                          <span className="step-number">
                            <AnimatePresence mode="wait" initial={false}>
                              {completed ? (
                                <motion.span
                                  key="check"
                                  initial={{ scale: 0.5, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                >
                                  <Check size={15} />
                                </motion.span>
                              ) : (
                                <motion.span
                                  key="number"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                >
                                  {task.id.toString().padStart(2, "0")}
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </span>
                          <span className="step-copy">
                            <strong>{task.title}</strong>
                            <small>{task.summary}</small>
                          </span>
                          <span className={`step-status ${statusClass}`}>
                            {status}
                          </span>
                          <ChevronDown size={16} />
                        </button>
                        <AnimatePresence initial={false}>
                          {openStep === task.id && (
                            <motion.div
                              className="quest-step__detail"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: reduceMotion ? 0 : 0.24,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                            >
                              <p>{task.detail}</p>
                              {task.requirements && (
                                <ul className="quest-step__requirements">
                                  {task.requirements.map(
                                    (requirement, index) => (
                                      <motion.li
                                        key={requirement}
                                        initial={{ opacity: 0, x: -5 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                          delay: reduceMotion
                                            ? 0
                                            : index * 0.045,
                                        }}
                                      >
                                        {requirement}
                                      </motion.li>
                                    ),
                                  )}
                                </ul>
                              )}
                              <TaskRenderer
                                task={task}
                                submission={submission}
                                locked={locked}
                                onChange={(next) => updateTask(task.id, next)}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </main>
            <aside className="detail-content-sidebar">
              <section className="leaderboard quest-panel quest-panel--interactive">
                <div className="panel-heading">
                  <h2>Bảng xếp hạng</h2>
                  <Trophy size={21} />
                </div>
                <div className="leader-list">
                  {[
                    [
                      "01",
                      "avatar-yellow",
                      leaderHoangNamAvatar,
                      "Hoàng Nam",
                      "6/7 nhiệm vụ",
                      "1.840 XP",
                      "is-top",
                    ],
                    [
                      "02",
                      "avatar-blue",
                      leaderMinhChauAvatar,
                      "Minh Châu",
                      "5/7 nhiệm vụ",
                      "1.620 XP",
                      "",
                    ],
                    [
                      "03",
                      "avatar-purple",
                      leaderLinhNguyenAvatar,
                      "Linh Nguyễn",
                      "4/7 nhiệm vụ",
                      "1.280 XP",
                      "",
                    ],
                    [
                      "—",
                      "avatar-orange",
                      leaderYouAvatar,
                      "Bạn",
                      `${completedCount}/${coreTasks.length} nhiệm vụ`,
                      `${earnedXp.toLocaleString("vi-VN")} XP`,
                      "is-you",
                    ],
                  ].map(
                    ([rank, avatar, avatarImage, name, count, xp, state]) => (
                      <motion.div
                        layout
                        key={name}
                        className={`leader ${state}`}
                      >
                        <span className="leader-rank">{rank}</span>
                        <span className={`leader-avatar ${avatar}`}>
                          <img src={avatarImage} alt={`Ảnh đại diện ${name}`} />
                        </span>
                        <div>
                          <strong>{name}</strong>
                          <small>{count}</small>
                        </div>
                        <b>{xp}</b>
                      </motion.div>
                    ),
                  )}
                </div>
                <button className="leader-link">
                  Xem toàn bộ bảng xếp hạng <ArrowRight size={15} />
                </button>
              </section>
              <section className="quest-panel progress-panel progress-panel--community">
                <div className="panel-heading">
                  <h2>Tổng quan</h2>
                </div>
                <div className="progress-community">
                  <div className="progress-community__headline">
                    <strong>
                      <AnimatedNumber
                        value={286450}
                        format={(value) => value.toLocaleString("vi-VN")}
                      />
                      <span>XP</span>
                    </strong>
                    <span>XP đã ghi nhận</span>
                  </div>
                  <div className="progress-community__signals">
                    <div>
                      <strong>
                        <AnimatedNumber value={1284} />
                      </strong>
                      <span>người tham gia</span>
                    </div>
                    <div>
                      <strong>
                        <AnimatedNumber value={438} />
                      </strong>
                      <span>demo đã nộp</span>
                    </div>
                    <div>
                      <strong>
                        <AnimatedNumber
                          value={61}
                          format={(value) => `${value}%`}
                        />
                      </strong>
                      <span>hoàn tất bước đầu</span>
                    </div>
                  </div>
                  <div className="progress-community__ratio">
                    <span>438 / 1.284 người đã nộp demo</span>
                    <i>
                      <motion.em
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true, amount: 0.55 }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.7,
                          ease: "easeOut",
                        }}
                      />
                    </i>
                  </div>
                  <p>Số liệu campaign minh hoạ.</p>
                </div>
              </section>
              <section className="quest-panel progress-panel progress-panel--personal">
                <div className="panel-heading">
                  <h2>Điểm & nhiệm vụ</h2>
                </div>
                <div className="progress-personal">
                  <div
                    className="progress-rail"
                    role="list"
                    aria-label="Chín nhiệm vụ trong quest"
                  >
                    {campaignTasks.map((task) => {
                      const completed = isComplete(questState.tasks[task.id]);
                      const current = !completed && task.id === nextTaskId;
                      return (
                        <motion.div
                          layout
                          key={task.id}
                          role="listitem"
                          title={task.title}
                          className={`progress-rail__item ${completed ? "is-complete" : ""} ${current ? "is-current" : ""}`}
                          initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{
                            duration: reduceMotion ? 0 : 0.22,
                            delay: reduceMotion ? 0 : task.id * 0.035,
                          }}
                        >
                          <span>
                            {completed ? (
                              <Check size={16} />
                            ) : (
                              task.id.toString().padStart(2, "0")
                            )}
                          </span>
                        </motion.div>
                      );
                    })}
                    <div
                      className="progress-rail__item progress-rail__item--empty"
                      role="listitem"
                      aria-label="Nhiệm vụ sắp có"
                    />
                  </div>
                  <div className="progress-personal__xp">
                    <strong>
                      <AnimatedNumber
                        value={earnedXp}
                        format={(value) => value.toLocaleString("vi-VN")}
                      />{" "}
                      / {totalFixedQuestXp.toLocaleString("vi-VN")} XP
                    </strong>
                    <i>
                      <motion.em
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: earnedXp / totalFixedQuestXp }}
                        transition={{
                          duration: reduceMotion ? 0 : 0.42,
                          ease: "easeOut",
                        }}
                      />
                    </i>
                  </div>
                </div>
              </section>
            </aside>
          </div>
          <section className="related-quests">
            <div className="related-quests__head">
              <h2>Nhiệm vụ nổi bật</h2>
              <Link to="/quests">
                Xem tất cả quest <ArrowRight size={16} />
              </Link>
            </div>
            <div className="related-quests__grid">
              {relatedQuests.map((related) => (
                <motion.article
                  key={related.title}
                  className="related-quest"
                  whileHover={reduceMotion ? undefined : { y: -5 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="related-quest__image">
                    <img src={related.image} alt="" />
                  </div>
                  <div>
                    <span>{related.label}</span>
                    <h3>{related.title}</h3>
                    <p>{related.description}</p>
                    <small>{related.status}</small>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </PublicPageLayout>
  );
}

export default function Quests() {
  const { slug } = useParams();
  const quest = quests.find((item) => item.slug === slug);
  return quest?.slug === "build-your-first-ai-agent" ? (
    <CampaignQuestDetail quest={quest} />
  ) : (
    <QuestList />
  );
}
