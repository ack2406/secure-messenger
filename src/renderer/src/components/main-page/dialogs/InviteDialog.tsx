import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  HStack,
  Button,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogBody
} from '@chakra-ui/react'
import { useRef } from 'react'
import { Socket } from 'socket.io-client'

interface InviteDialogProps {
  openAcceptDialog: boolean
  setOpenAcceptDialog: (open: boolean) => void
  acceptInvite: () => void
  inviter: string
}

function InviteDialog({ openAcceptDialog, setOpenAcceptDialog, acceptInvite, inviter }: InviteDialogProps) {
  const cancelRef = useRef(null)
  const onClose = () => setOpenAcceptDialog(false)

  const onCloseAccept = () => {
    setOpenAcceptDialog(false)
    acceptInvite()
  }

  return (
    <AlertDialog isOpen={openAcceptDialog} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Invitation
          </AlertDialogHeader>

          <AlertDialogBody>
            Do you want to add {inviter} to friends?
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="purple" onClick={onCloseAccept} ml={3}>
              Accept
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}

export default InviteDialog
