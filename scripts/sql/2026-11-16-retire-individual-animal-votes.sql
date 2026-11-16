-- Apply only to the A Cup of Zoo CMS database after the party ballot is live.
-- The old CMS endpoint treats an ignored increment as a vote that was not accepted.
CREATE TRIGGER IF NOT EXISTS retire_legacy_animal_vote_insert
BEFORE INSERT ON animal_vote_counts
BEGIN
  SELECT RAISE(IGNORE);
END;

DELETE FROM audit_logs
WHERE action = 'animal.voted' AND entity_type = 'animal-votes';

DELETE FROM animal_vote_counts;
