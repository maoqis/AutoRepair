package com.sabbir.autorepair.model.repository;

import com.sabbir.autorepair.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> getCommentsByRepairId(Long repairId);

    Comment findCommentById(Long commentId);
}
