-- ============================================================
-- BOOKING PAYMENTS
-- Production-safe payment tracking for existing bookings.
-- Existing booking records remain untouched.
-- ============================================================

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_status text
    NOT NULL DEFAULT 'unpaid';

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_provider text;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_reference text;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_amount numeric;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_currency text
    NOT NULL DEFAULT 'usd';

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS paid_at timestamptz;

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS payment_metadata jsonb
    NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS bookings_payment_status_idx
  ON public.bookings(payment_status);

CREATE INDEX IF NOT EXISTS bookings_payment_reference_idx
  ON public.bookings(payment_reference);

-- Keep payment states predictable.
ALTER TABLE public.bookings
  DROP CONSTRAINT IF EXISTS bookings_payment_status_check;

ALTER TABLE public.bookings
  ADD CONSTRAINT bookings_payment_status_check
  CHECK (
    payment_status IN (
      'unpaid',
      'pending',
      'paid',
      'failed',
      'refunded',
      'cancelled'
    )
  );
