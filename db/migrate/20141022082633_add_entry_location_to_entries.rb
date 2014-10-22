class AddEntryLocationToEntries < ActiveRecord::Migration
  def change
    add_reference :entries, :entry_location, index: true
  end
end
