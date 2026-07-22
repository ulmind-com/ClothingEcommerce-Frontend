import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import {
  createReview,
  fetchCanReview,
  REVIEW_TAGS,
} from "@/lib/api/reviews";
import { qk } from "@/lib/api/queries";
import { useAuth } from "@/lib/auth/store";
import { cn } from "@/lib/utils/format";

/**
 * Reviews are gated server-side: only a customer with a delivered order for
 * this product, who hasn't reviewed it yet, may post. We ask /can-review so the
 * form isn't shown to someone who'd only get a 403.
 */
export function ReviewForm({ productId }: { productId: string }) {
  const signedIn = useAuth((s) => Boolean(s.token));
  const queryClient = useQueryClient();

  const { data: eligibility } = useQuery({
    queryKey: ["reviews", "can-review", productId],
    queryFn: () => fetchCanReview(productId),
    enabled: signedIn,
    retry: false,
  });

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const submit = useMutation({
    mutationFn: () =>
      createReview({ product_id: productId, rating, title, text, tags }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.reviews(productId) });
      queryClient.invalidateQueries({ queryKey: qk.reviewSummary(productId) });
      queryClient.invalidateQueries({
        queryKey: ["reviews", "can-review", productId],
      });
      setRating(0);
      setTitle("");
      setText("");
      setTags([]);
      toast.success("Thank you for your review");
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Could not post review"),
  });

  if (!signedIn || !eligibility) return null;

  if (eligibility.already) {
    return (
      <p className="mt-8 text-sm text-warm-gray">
        You've already reviewed this piece.
      </p>
    );
  }

  if (!eligibility.delivered) {
    return (
      <p className="mt-8 text-sm text-warm-gray">
        You can review this piece once your order has been delivered.
      </p>
    );
  }

  return (
    <div className="mt-10 border border-border p-8">
      <h3 className="eyebrow mb-6">Write a review</h3>

      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${n} star${n === 1 ? "" : "s"}`}
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="p-1"
          >
            <Star
              className={cn(
                "h-6 w-6 transition-colors",
                (hover || rating) >= n
                  ? "fill-champagne text-champagne"
                  : "text-border",
              )}
            />
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {REVIEW_TAGS.map((t) => {
          const on = tags.includes(t);
          return (
            <button
              key={t}
              type="button"
              onClick={() =>
                setTags(on ? tags.filter((x) => x !== t) : [...tags, t])
              }
              className={cn(
                "eyebrow border px-4 py-2 transition-colors",
                on ? "border-ink bg-ink text-cream" : "border-border text-ink",
              )}
            >
              {t}
            </button>
          );
        })}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Headline"
        maxLength={120}
        className="mt-6 w-full border-b border-border bg-transparent py-3 text-sm text-ink outline-none focus:border-ink"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="How did it fit? How does it feel?"
        className="mt-4 w-full resize-none border border-border bg-transparent p-3 text-sm text-ink outline-none focus:border-ink"
      />

      <button
        disabled={rating === 0 || submit.isPending}
        onClick={() => submit.mutate()}
        className="eyebrow mt-6 bg-ink px-10 py-4 text-cream transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {submit.isPending
          ? "Posting…"
          : rating === 0
            ? "Choose a rating"
            : "Post review"}
      </button>
    </div>
  );
}
