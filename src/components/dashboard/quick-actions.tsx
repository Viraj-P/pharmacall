'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Phone, Plus, Calendar, MessageSquare } from 'lucide-react'

export function QuickActions() {
  const [newCallOpen, setNewCallOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleNewCall = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const callData = {
      patient_id: formData.get('patient_id') as string,
      call_type: formData.get('call_type') as string,
      scheduled_at: formData.get('scheduled_at') as string,
      custom_prompt: formData.get('custom_prompt') as string,
    }

    try {
      const response = await fetch('/api/calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(callData),
      })

      if (response.ok) {
        setNewCallOpen(false)
        // Refresh the page or update state
        window.location.reload()
      } else {
        const error = await response.json()
        alert(`Failed to create call: ${error.error}`)
      }
    } catch (error) {
      console.error('Failed to create call:', error)
      alert('Failed to create call')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={newCallOpen} onOpenChange={setNewCallOpen}>
          <DialogTrigger asChild>
            <Button className="w-full" variant="outline">
              <Phone className="h-4 w-4 mr-2" />
              Initiate New Call
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Initiate New Call</DialogTitle>
              <DialogDescription>
                Start a new voice call with a patient
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewCall} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient_id">Patient ID</Label>
                <Input
                  id="patient_id"
                  name="patient_id"
                  placeholder="Enter patient ID"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="call_type">Call Type</Label>
                <Select name="call_type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select call type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery_scheduling">Delivery Scheduling</SelectItem>
                    <SelectItem value="medication_change">Medication Change</SelectItem>
                    <SelectItem value="shipment_feedback">Shipment Feedback</SelectItem>
                    <SelectItem value="general_inquiry">General Inquiry</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduled_at">Schedule (Optional)</Label>
                <Input
                  id="scheduled_at"
                  name="scheduled_at"
                  type="datetime-local"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom_prompt">Custom Instructions (Optional)</Label>
                <Textarea
                  id="custom_prompt"
                  name="custom_prompt"
                  placeholder="Any specific instructions for this call..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewCallOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Call'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Button className="w-full" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add New Patient
        </Button>

        <Button className="w-full" variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          View Schedule
        </Button>

        <Button className="w-full" variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          View Transcripts
        </Button>
      </CardContent>
    </Card>
  )
}
