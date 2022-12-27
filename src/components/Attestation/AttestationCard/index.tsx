/* eslint-disable @next/next/no-img-element */
import { useEffect, useImperativeHandle, useMemo, useState } from "react";
import { useCastVote } from "../../../hooks/write/useCastVote";
import { convertPercentsToPoints } from "../../../utils/scorecard";
import Group from "../../Group";
import Button from "../../UI/Button";
import CustomModal from "../../UI/Modal";
import { ScoreCard } from "../types";
import styles from "./AttestationCard.module.css";

interface AttestationCardProps {
  proposal: ScoreCard;
  tiers: any[];
}

const AttestationCard: React.FC<AttestationCardProps> = (props) => {
  const [openModal, setIsOpenModal] = useState<boolean>(false);
  const [votingOption, setVotingOption] = useState<number>();
  const { write, isLoading, isError } = useCastVote(
    props.proposal.scoreCard.proposalId,
    votingOption
  );

  useEffect(() => {
    if (isLoading || isError) {
      setVotingOption(undefined);
    }
  }, [isLoading, isError]);

  const icon = useMemo<string | undefined>(() => {
    switch (props.proposal.isEqual) {
      case true:
        return "/assets/defifa.svg";
      case false:
        return "/assets/scorecard-small.png";
      default:
        break;
    }
  }, [props.proposal.isEqual]);

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const toggleVotingYesOption = () => {
    setVotingOption((prevValue) => {
      if (prevValue === 1) {
        return undefined;
      }
      return 1;
    });
  };

  const toggleVotingNoOption = () => {
    setVotingOption((prevValue) => {
      if (prevValue === 0) {
        return undefined;
      }
      return 0;
    });
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.scoreCardExpand} onClick={handleOpenModal}>
          <Button size="small">View</Button>
        </div>

        <div className={styles.scoreCardInfo}>
          <img
            src={icon}
            alt="Scorecard"
            width={props.proposal.isEqual ? 98 : 81}
          />
          <p className={styles.scoreCardTitle}>{props.proposal.title}</p>
          <div className={styles.voteForm}>
            <p>Cast your vote</p>
            <div
              className={styles.votingOptions}
              onClick={toggleVotingYesOption}
              style={{
                border:
                  votingOption === 1
                    ? "2px solid var(--gold)"
                    : "2px solid var(--bgColor)",
              }}
            >
              Yes
            </div>
            <div
              className={styles.votingOptions}
              onClick={toggleVotingNoOption}
              style={{
                border:
                  votingOption === 0
                    ? "2px solid var(--gold)"
                    : "2px solid var(--bgColor)",
              }}
            >
              No
            </div>

            <Button
              onClick={() => write?.()}
              disabled={votingOption === undefined}
            >
              {isLoading ? (
                <img
                  style={{ marginTop: "5px" }}
                  src="/assets/defifa_spinner.gif"
                  alt="spinner"
                  width={35}
                />
              ) : (
                "Vote"
              )}
            </Button>
          </div>

          <CustomModal
            openModal={openModal}
            onAfterClose={() => handleCloseModal()}
          >
            <div className={styles.scoreCardContainer}>
              <p className={styles.scoreCardTitle}>{props.proposal.title}</p>

              <div className={styles.scoreCardGroupsContainer}>
                {props.tiers.map((tiers: any, index: any) => (
                  <Group
                    groupName={`${String.fromCharCode(97 + index)}`}
                    key={index}
                  >
                    {tiers.map((t: any) => (
                      <div key={t.id}>
                        <input
                          className={styles.ballKidsScoreCardInput}
                          readOnly
                          value={convertPercentsToPoints(
                            props.proposal.scoreCard.tierWeights.find(
                              (score) => score.id === t.id
                            )?.redemptionWeight,
                            props.proposal.scoreCard.tierWeights
                          )}
                          type="number"
                        />
                        <p>{t.teamName}</p>
                      </div>
                    ))}
                  </Group>
                ))}
              </div>
            </div>
          </CustomModal>
        </div>
      </div>
    </div>
  );
};

export default AttestationCard;