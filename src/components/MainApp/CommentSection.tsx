import React, { useState } from 'react';
import { Comment } from '../../types';
import { Button } from '../UI/Button';
import { addComment } from '../../utils/storage';
import { DIRECTOR_NAME, PRODUCER_NAME } from '../../utils/constants';
import styles from './MainApp.module.css';

interface CommentSectionProps {
  eventId: string;
  comments: Comment[];
  onUpdate: () => void;
  onCommentAdded?: (count: number) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  eventId,
  comments,
  onUpdate,
  onCommentAdded
}) => {
  const [newComment, setNewComment] = useState('');
  const [author, setAuthor] = useState<'NIK' | 'ELINA'>('NIK');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      addComment(eventId, author, newComment.trim());
      setNewComment('');
      onUpdate();
      
      if (onCommentAdded) {
        onCommentAdded(comments.length + 1);
      }
    }
  };

  return (
    <div className={styles.commentSection}>
      <div className={styles.commentList}>
        {comments.length === 0 ? (
          <div className={styles.noComments}>
            <span className={styles.emptyIcon}>📝</span>
            <p>Заметок пока нет.</p>
          </div>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className={styles.comment}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>
                  {comment.author === 'NIK' ? ` ${DIRECTOR_NAME}` : `📋 ${PRODUCER_NAME}`}
                </span>
                <span className={styles.commentTime}>
                  {new Date(comment.timestamp).toLocaleString('ru-RU', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className={styles.commentText}>{comment.text}</div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <div className={styles.commentAs}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="NIK"
              checked={author === 'NIK'}
              onChange={(e) => setAuthor(e.target.value as 'NIK')}
            />
            <span> {DIRECTOR_NAME}</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              value="ELINA"
              checked={author === 'ELINA'}
              onChange={(e) => setAuthor(e.target.value as 'ELINA')}
            />
            <span>📋 {PRODUCER_NAME}</span>
          </label>
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Оставь заметку..."
          className={styles.commentInput}
          rows={2}
        />
        <div className={styles.commentActions}>
          <Button type="submit" size="small">
            ДОБАВИТЬ ЗАМЕТКУ
          </Button>
          <span className={styles.commentHint}>
            {author === 'NIK' ? 'Director\'s Note' : 'Producer\'s Note'}
          </span>
        </div>
      </form>
    </div>
  );
};