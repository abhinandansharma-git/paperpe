-- PaperPe Database Schema
-- Run this in Supabase SQL Editor

-- Waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'landing',
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Users table (for when we launch)
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  virtual_balance DECIMAL(15, 2) DEFAULT 1000000.00, -- ₹10 lakhs
  total_pnl DECIMAL(15, 2) DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  winning_trades INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Paper trades table
CREATE TABLE IF NOT EXISTS paper_trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  symbol TEXT NOT NULL,
  instrument_type TEXT DEFAULT 'FUTURES', -- FUTURES, OPTIONS, EQUITY
  direction TEXT NOT NULL CHECK (direction IN ('LONG', 'SHORT')),
  quantity INTEGER NOT NULL,
  lot_size INTEGER DEFAULT 1,
  entry_price DECIMAL(15, 2) NOT NULL,
  exit_price DECIMAL(15, 2),
  stop_loss DECIMAL(15, 2),
  target DECIMAL(15, 2),
  status TEXT DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'CANCELLED')),
  pnl DECIMAL(15, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE paper_trades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own trades" ON paper_trades
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own trades" ON paper_trades
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trades" ON paper_trades
  FOR UPDATE USING (auth.uid() = user_id);

-- Leaderboard view
CREATE OR REPLACE VIEW leaderboard AS
SELECT 
  u.id,
  u.display_name,
  u.total_pnl,
  u.total_trades,
  u.winning_trades,
  CASE WHEN u.total_trades > 0 
    THEN ROUND((u.winning_trades::DECIMAL / u.total_trades) * 100, 1) 
    ELSE 0 
  END as win_rate,
  RANK() OVER (ORDER BY u.total_pnl DESC) as rank
FROM users u
WHERE u.total_trades >= 5 -- Minimum trades to appear on leaderboard
ORDER BY u.total_pnl DESC
LIMIT 100;

-- Function to update user stats after trade closes
CREATE OR REPLACE FUNCTION update_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'CLOSED' AND OLD.status = 'OPEN' THEN
    UPDATE users SET
      total_pnl = total_pnl + COALESCE(NEW.pnl, 0),
      total_trades = total_trades + 1,
      winning_trades = winning_trades + CASE WHEN NEW.pnl > 0 THEN 1 ELSE 0 END,
      virtual_balance = virtual_balance + COALESCE(NEW.pnl, 0),
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_trade_closed
  AFTER UPDATE ON paper_trades
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_paper_trades_user_id ON paper_trades(user_id);
CREATE INDEX IF NOT EXISTS idx_paper_trades_status ON paper_trades(status);
CREATE INDEX IF NOT EXISTS idx_users_total_pnl ON users(total_pnl DESC);
