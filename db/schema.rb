# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141023204145) do

  create_table "entries", force: true do |t|
    t.string   "title"
    t.text     "content"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "entry_location_id"
  end

  add_index "entries", ["entry_location_id"], name: "index_entries_on_entry_location_id"
  add_index "entries", ["user_id"], name: "index_entries_on_user_id"

  create_table "entry_locations", force: true do |t|
    t.float    "latitude"
    t.float    "longitude"
    t.string   "city"
    t.string   "country"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "joy_counts", force: true do |t|
    t.integer  "post_id"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "joy_counts", ["post_id"], name: "index_joy_counts_on_post_id"
  add_index "joy_counts", ["user_id"], name: "index_joy_counts_on_user_id"

  create_table "locations", force: true do |t|
    t.float    "latitude"
    t.float    "longitude"
    t.string   "city"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "country"
  end

  create_table "messages", force: true do |t|
    t.text     "content"
    t.integer  "post_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.string   "color",      default: "p_green"
  end

  add_index "messages", ["post_id"], name: "index_messages_on_post_id"
  add_index "messages", ["user_id"], name: "index_messages_on_user_id"

  create_table "posts", force: true do |t|
    t.string   "title"
    t.text     "content"
    t.string   "name"
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "joys",        default: 0
    t.string   "color",       default: "p_green"
    t.integer  "location_id"
  end

  add_index "posts", ["location_id"], name: "index_posts_on_location_id"
  add_index "posts", ["user_id"], name: "index_posts_on_user_id"

  create_table "users", force: true do |t|
    t.string   "alias"
    t.string   "email"
    t.string   "salt"
    t.string   "encrypted_password"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "kira",               default: true
    t.boolean  "admin",              default: false
    t.boolean  "message_seen",       default: true
  end

end
