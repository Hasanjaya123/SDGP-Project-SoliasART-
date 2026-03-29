import pytest
from unittest.mock import MagicMock
from uuid import uuid4
from fastapi import HTTPException

from app.modules.Feed.router import (
    get_target_or_404,
    toggle_like,
    toggle_save,
    add_comment,
    get_comments,
    track_view,
    get_feed
)
from app.modules.Feed.schemas import CommentCreate
from app.modules.Feed.model import FeedLike, FeedSave, FeedComment, FeedInteraction
from app.modules.PostUpload.model import Post
from app.modules.ArtUpload.model import ArtWork

def test_get_target_or_404_invalid_type():
    mock_db = MagicMock()
    with pytest.raises(HTTPException) as excinfo:
        get_target_or_404("invalid_type", uuid4(), mock_db)
    
    assert excinfo.value.status_code == 400
    assert excinfo.value.detail == "target_type must be 'post' or 'artwork'"

def test_get_target_or_404_not_found():
    mock_db = MagicMock()
    # Mocking first() to return None simulating item not found
    mock_db.query.return_value.filter.return_value.first.return_value = None
    
    with pytest.raises(HTTPException) as excinfo:
        get_target_or_404("post", uuid4(), mock_db)
    
    assert excinfo.value.status_code == 404
    assert excinfo.value.detail == "post not found"

def test_get_target_or_404_success():
    mock_db = MagicMock()
    mock_item = MagicMock()
    mock_db.query.return_value.filter.return_value.first.return_value = mock_item
    
    result = get_target_or_404("artwork", uuid4(), mock_db)
    assert result == mock_item

def test_toggle_like_add_like():
    mock_db = MagicMock()
    target_id = uuid4()
    user_id = uuid4()
    
    # Mock get_target_or_404 to succeed
    mock_db.query.return_value.filter.return_value.first.side_effect = [
        MagicMock(), # First query is inside get_target_or_404 (returns target)
        None         # Second query is checking for existing FeedLike (returns None)
    ]
    # Mock the count query
    mock_db.query.return_value.filter.return_value.scalar.return_value = 1
    
    result = toggle_like("post", target_id, user_id, mock_db)
    
    assert result["target_id"] == target_id
    assert result["is_liked_by_me"] is True
    assert result["like_count"] == 1
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called()

def test_toggle_like_remove_like():
    mock_db = MagicMock()
    target_id = uuid4()
    user_id = uuid4()
    
    existing_like = MagicMock()
    
    mock_db.query.return_value.filter.return_value.first.side_effect = [
        MagicMock(),   # get_target_or_404 returns target
        existing_like  # query FeedLike returns existing
    ]
    mock_db.query.return_value.filter.return_value.scalar.return_value = 0
    
    result = toggle_like("artwork", target_id, user_id, mock_db)
    
    assert result["target_id"] == target_id
    assert result["is_liked_by_me"] is False
    assert result["like_count"] == 0
    mock_db.delete.assert_called_once_with(existing_like)
    mock_db.commit.assert_called()

def test_toggle_save_add_save():
    mock_db = MagicMock()
    target_id = uuid4()
    user_id = uuid4()
    
    mock_db.query.return_value.filter.return_value.first.side_effect = [
        MagicMock(), # get_target_or_404 returns target
        None         # query FeedSave returns None
    ]
    
    result = toggle_save("post", target_id, user_id, mock_db)
    
    assert result["target_id"] == target_id
    assert result["is_saved"] is True
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called()

def test_toggle_save_remove_save():
    mock_db = MagicMock()
    target_id = uuid4()
    user_id = uuid4()
    
    existing_save = MagicMock()
    mock_db.query.return_value.filter.return_value.first.side_effect = [
        MagicMock(),   # get_target_or_404
        existing_save  # current save
    ]
    
    result = toggle_save("artwork", target_id, user_id, mock_db)
    
    assert result["target_id"] == target_id
    assert result["is_saved"] is False
    mock_db.delete.assert_called_once_with(existing_save)
    mock_db.commit.assert_called()

def test_add_comment():
    mock_db = MagicMock()
    target_id = uuid4()
    user_id = uuid4()
    
    mock_db.query.return_value.filter.return_value.first.return_value = MagicMock() # target exists
    mock_db.query.return_value.filter.return_value.scalar.return_value = "Test User Full Name" # user name
    
    body = CommentCreate(user_id=user_id, content="Great artwork!")
    
    result = add_comment("artwork", target_id, body, mock_db)
    
    assert result["user_id"] == user_id
    assert result["user_name"] == "Test User Full Name"
    assert result["content"] == "Great artwork!"
    
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once()

def test_get_comments():
    mock_db = MagicMock()
    target_id = uuid4()
    user_id = uuid4()
    
    mock_comment = MagicMock()
    mock_comment.user_id = user_id
    mock_comment.content = "Nice post!"
    
    # Mocking rows returned by outerjoin query
    mock_db.query.return_value.outerjoin.return_value.filter.return_value = [
        (mock_comment, "Alice")
    ]
    
    result = get_comments("post", target_id, mock_db)
    
    assert len(result) == 1
    assert result[0]["user_id"] == user_id
    assert result[0]["user_name"] == "Alice"
    assert result[0]["content"] == "Nice post!"

def test_track_view_new_view():
    mock_db = MagicMock()
    target_id = uuid4()
    user_id = uuid4()
    
    mock_db.query.return_value.filter.return_value.first.side_effect = [
        MagicMock(), # get_target_or_404
        None         # FeedInteraction not found
    ]
    
    result = track_view("post", target_id, user_id, mock_db)
    
    assert result["message"] == "view recorded"
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()

def test_track_view_already_viewed():
    mock_db = MagicMock()
    target_id = uuid4()
    user_id = uuid4()
    
    mock_db.query.return_value.filter.return_value.first.side_effect = [
        MagicMock(), # get_target_or_404
        MagicMock()  # FeedInteraction already exists
    ]
    
    result = track_view("artwork", target_id, user_id, mock_db)
    
    assert result["message"] == "view recorded"
    mock_db.add.assert_not_called()
    mock_db.commit.assert_not_called()
