
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pest_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;


CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete their own profile" ON profiles FOR DELETE USING (auth.uid() = id);


CREATE POLICY "Users can view their own advisories" ON crop_advisories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own advisories" ON crop_advisories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own advisories" ON crop_advisories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own advisories" ON crop_advisories FOR DELETE USING (auth.uid() = user_id);


CREATE POLICY "Users can view their own pest detections" ON pest_detections FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own pest detections" ON pest_detections FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own pest detections" ON pest_detections FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own pest detections" ON pest_detections FOR DELETE USING (auth.uid() = user_id);


CREATE POLICY "Users can view their own price alerts" ON price_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own price alerts" ON price_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own price alerts" ON price_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own price alerts" ON price_alerts FOR DELETE USING (auth.uid() = user_id);


CREATE POLICY "Users can view their own feedback" ON feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own feedback" ON feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own feedback" ON feedback FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own feedback" ON feedback FOR DELETE USING (auth.uid() = user_id);
